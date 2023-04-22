import FormCheckBoxGroup from "components/Form/FormCheckBoxGroup";
import FormInput from "components/Form/FormInput";
import FormSelect from "components/Form/FormSelect";
import { Form, Formik, FormikHelpers } from "formik";
import useAPI from "hooks/useAPI";
import React, { useEffect, useState } from "react";
import { Button, Col, InputGroup, Modal, Row } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { alertActions } from "store/slices/alertSlice";
import { HttpMethod } from "utils/httpMethods";
import * as Yup from "yup";
import {
  emailOptions,
  IUserFormValues,
  IUserResponse,
  transformInstitutionsResponse,
  transformRolesResponse,
  transformUserRequest,
  transformUserResponse
} from "./userUtil";

/**
 * @author Ankur Mundra on April, 2023
 */

interface IUserEditor {
  mode: "create" | "update";
  userData?: IUserResponse;
  onClose: (user?: IUserResponse) => void;
}

// Get the logged-in user from the session
const loggedInUser = null;

const initialValues: IUserFormValues = {
  name: "",
  email: "",
  firstName: "",
  lastName: "",
  role_id: "",
  institution_id: "",
  emailPreferences: [],
};

const validationSchema = Yup.object({
  name: Yup.string()
    .required("Required")
    .lowercase("Username must be lowercase")
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be at most 20 characters"),
  email: Yup.string().required("Required").email("Invalid email format"),
  firstName: Yup.string().required("Required").nonNullable(),
  lastName: Yup.string().required("Required").nonNullable(),
  role: Yup.string().required("Required").nonNullable(),
  institution: Yup.string().required("Required").nonNullable(),
});

const UserEditor: React.FC<IUserEditor> = ({ mode, userData, onClose }) => {
  const dispatch = useDispatch();
  const [show, setShow] = useState(true);
  const { data: roles, sendRequest: fetchRoles } = useAPI();
  const { data: institutions, sendRequest: fetchInstitutions } = useAPI();
  const { data: user, error: userError, sendRequest } = useAPI();

  useEffect(() => {
    fetchRoles({ url: "/roles", transformResponse: transformRolesResponse });
    fetchInstitutions({ url: "/institutions", transformResponse: transformInstitutionsResponse });
  }, [fetchRoles, fetchInstitutions]);

  // Close the modal if the user is updated successfully and pass the updated user to the parent component
  useEffect(() => {
    if (user.length > 0) {
      onClose(user[0]);
      setShow(false);
    }
  }, [user, onClose]);

  useEffect(() => {
    if (userError) {
      dispatch(alertActions.showAlert({ variant: "danger", message: userError }));
    }
  }, [userError, dispatch]);

  const onSubmit = (values: IUserFormValues, submitProps: FormikHelpers<IUserFormValues>) => {
    let method: HttpMethod = HttpMethod.POST;
    let url: string = "/users";

    if (mode === "update") {
      url = `/users/${userData!.id}`;
      method = HttpMethod.PATCH;
    }

    values.parent_id = loggedInUser;
    sendRequest({
      url: url,
      method: method,
      data: values,
      transformRequest: transformUserRequest,
    });
    submitProps.resetForm();
    submitProps.setSubmitting(false);
  };

  const handleClose = () => {
    setShow(false);
    onClose();
  };

  return (
    <Modal size="lg" centered show={show} onHide={handleClose} backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Update User</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {userError && <p className="text-danger">{userError}</p>}
        <Formik
          initialValues={mode === "update" ? transformUserResponse(userData!) : initialValues}
          onSubmit={onSubmit}
          validationSchema={validationSchema}
          validateOnChange={false}
          enableReinitialize={true}
        >
          {(formik) => {
            return (
              <Form>
                <FormSelect
                  controlId="user-role"
                  name="role_id"
                  options={roles}
                  inputGroupPrepend={<InputGroup.Text id="role-prepend">Role</InputGroup.Text>}
                />
                <FormInput
                  controlId="user-name"
                  label="Username"
                  name="name"
                  disabled={mode === "update"}
                  inputGroupPrepend={<InputGroup.Text id="user-name-prep">@</InputGroup.Text>}
                />
                <Row>
                  <FormInput
                    as={Col}
                    controlId="user-first-name"
                    label="First name"
                    name="firstName"
                  />
                  <FormInput
                    as={Col}
                    controlId="user-last-name"
                    label="Last name"
                    name="lastName"
                  />
                </Row>
                <FormInput controlId="user-email" label="Email" name="email" />
                <FormCheckBoxGroup
                  controlId="email-pref"
                  label="Email Preferences"
                  name="emailPreferences"
                  options={emailOptions}
                />
                <FormSelect
                  controlId="user-institution"
                  name="institution_id"
                  disabled={mode === "update"}
                  options={institutions}
                  inputGroupPrepend={
                    <InputGroup.Text id="user-inst-prep">Institution</InputGroup.Text>
                  }
                />

                <Modal.Footer>
                  <Button variant="outline-secondary" onClick={handleClose}>
                    Close
                  </Button>
                  <Button
                    variant="outline-success"
                    type="submit"
                    disabled={!(formik.isValid && formik.dirty) || formik.isSubmitting}
                  >
                    Update User
                  </Button>
                </Modal.Footer>
              </Form>
            );
          }}
        </Formik>
      </Modal.Body>
    </Modal>
  );
};

export default UserEditor;
