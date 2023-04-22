import { Row as TRow } from "@tanstack/react-table";
import { AddUserIcon } from "components/Icons";
import Table from "components/Table/Table";
import useAPI from "hooks/useAPI";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { alertActions } from "store/slices/alertSlice";
import { userColumns as USER_COLUMNS } from "./userColumns";
import DeleteUser from "./UserDelete";
import UserEditor from "./UserEditor";
import { IUserResponse } from "./userUtil";

/**
 * @author Ankur Mundra on April, 2023
 */
const Users = () => {
  const dispatch = useDispatch();
  const {
    error,
    isLoading,
    data: userData,
    setData: setUserData,
    sendRequest: fetchUsers,
  } = useAPI();

  const [showCreate, setShowCreate] = useState<boolean>(false);
  const [showUpdate, setShowUpdate] = useState<{
    visible: boolean;
    data?: IUserResponse;
  }>({
    visible: false,
  });
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState<{
    visible: boolean;
    data?: IUserResponse;
  }>({
    visible: false,
  });

  useEffect(() => fetchUsers({ url: "/users" }), [fetchUsers]);

  // Error alert
  useEffect(() => {
    if (error) {
      dispatch(alertActions.showAlert({ variant: "danger", message: error }));
    }
  }, [error, dispatch]);

  const onCreateUserHandler = useCallback(
    (user?: IUserResponse) => {
      if (user) {
        console.log("User Created", user);
        setUserData((prevData) => [...prevData, user]);
        dispatch(
          alertActions.showAlert({
            variant: "success",
            message: `User ${user.name} created successfully!`,
          })
        );
      }
      setShowCreate(false);
    },
    [setUserData, dispatch]
  );

  const onUpdateUserHandler = useCallback(
    (updatedUser?: IUserResponse) => {
      if (updatedUser) {
        setUserData((prevData) => [
          ...prevData.filter((user) => user.id !== updatedUser.id),
          updatedUser,
        ]);
        dispatch(
          alertActions.showAlert({
            variant: "success",
            message: `User ${updatedUser.name} updated successfully!`,
          })
        );
      }
      setShowUpdate({ visible: false });
    },
    [setUserData, dispatch]
  );

  const onDeleteUserHandler = useCallback(
    (id: number, name: string, status?: number) => {
      if (status) {
        setUserData((prevData) => prevData.filter((user) => user.id !== id));
        dispatch(
          alertActions.showAlert({
            variant: "success",
            message: `User ${name} deleted successfully!`,
          })
        );
      }
      setShowDeleteConfirmation({ visible: false });
    },
    [setUserData, dispatch]
  );

  const onEditHandle = (row: TRow<IUserResponse>) =>
    setShowUpdate({ visible: true, data: row.original });
  const onDeleteHandle = (row: TRow<IUserResponse>) =>
    setShowDeleteConfirmation({ visible: true, data: row.original });

  const tableColumns = useMemo(() => USER_COLUMNS(onDeleteHandle, onEditHandle), []);
  const tableData = useMemo(() => (isLoading ? [] : userData), [userData, isLoading]);
  return (
    <Container fluid className="px-md-4">
      <Row className="mt-md-2 mb-md-2">
        <Col md={{ span: 4, offset: 4 }}>
          <h1>Manage Users</h1>
        </Col>
        <hr />
      </Row>
      <Row>
        <Col md={{ span: 1, offset: 11 }}>
          <Button variant="outline-secondary" onClick={() => setShowCreate(true)}>
            <AddUserIcon />
          </Button>
        </Col>
        {showCreate && <UserEditor mode="create" onClose={onCreateUserHandler} />}
        {showUpdate.visible && (
          <UserEditor mode="update" userData={showUpdate.data} onClose={onUpdateUserHandler} />
        )}
        {showDeleteConfirmation.visible && (
          <DeleteUser
            userData={showDeleteConfirmation.data!}
            onClose={onDeleteUserHandler.bind(
              null,
              showDeleteConfirmation.data!.id,
              showDeleteConfirmation.data!.name
            )}
          />
        )}
      </Row>
      <Row>
        <Table data={tableData} columns={tableColumns} />
      </Row>
    </Container>
  );
};

export default Users;
