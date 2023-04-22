import { IFormOption } from "components/Form/interfaces";

/**
 * @author Ankur Mundra on April, 2023
 */
export interface IUserResponse {
  id: number;
  name: string;
  email: string;
  fullName: string;
  email_on_review: boolean;
  email_on_submission: boolean;
  email_on_review_of_review: boolean;
  role: { id: string; name: string };
  parent: { id: string; name: string };
  institution: { id: string; name: string };
}

export interface IUserRequest {
  name: string;
  email: string;
  fullName: string;
  role_id: string;
  parent_id?: string | null;
  institution_id: string;
  email_on_review?: boolean;
  email_on_submission?: boolean;
  email_on_review_of_review?: boolean;
}

export enum EmailPreference {
  EMAIL_ON_REVIEW = "email_on_review",
  EMAIL_ON_SUBMISSION = "email_on_submission",
  EMAIL_ON_META_REVIEW = "email_on_review_of_review",
}

type PermittedEmailPreferences =
  | EmailPreference.EMAIL_ON_REVIEW
  | EmailPreference.EMAIL_ON_SUBMISSION
  | EmailPreference.EMAIL_ON_META_REVIEW;

export interface IUserFormValues {
  name: string;
  email: string;
  firstName: string;
  lastName: string;
  role_id: string;
  parent_id?: string | null;
  institution_id: string;
  emailPreferences: Array<PermittedEmailPreferences>;
}

export interface IRole {
  id: number;
  name: string;
  parent_id: number;
}

export interface IInstitution {
  id: number;
  name: string;
}

export const emailOptions: IFormOption[] = [
  { label: "When someone else reviews my work", value: EmailPreference.EMAIL_ON_REVIEW },
  {
    label: "When someone else submits work I am assigned to review",
    value: EmailPreference.EMAIL_ON_SUBMISSION,
  },
  {
    label: "When someone else reviews one of my reviews (meta-reviews my work)",
    value: EmailPreference.EMAIL_ON_META_REVIEW,
  },
];

export const transformInstitutionsResponse = (institutionsList: string) => {
  let institutionsData: IFormOption[] = [{ label: "Select an Institution", value: "" }];
  let institutions: IInstitution[] = JSON.parse(institutionsList);
  institutions.forEach((institution) =>
    institutionsData.push({ label: institution.name, value: institution.id })
  );
  return institutionsData;
};

export const transformRolesResponse = (rolesList: string) => {
  let rolesData: IFormOption[] = [{ label: "Select a Role", value: "" }];
  let roles: IRole[] = JSON.parse(rolesList);
  roles.forEach((role) => rolesData.push({ label: role.name, value: role.id }));
  return rolesData;
};

export const transformUserRequest = (values: IUserFormValues) => {
  const user: IUserRequest = {
    name: values.name,
    email: values.email,
    role_id: values.role_id,
    parent_id: values.parent_id,
    institution_id: values.institution_id,
    fullName: values.lastName + ", " + values.firstName,
    email_on_review: values.emailPreferences.includes(EmailPreference.EMAIL_ON_REVIEW),
    email_on_submission: values.emailPreferences.includes(EmailPreference.EMAIL_ON_SUBMISSION),
    email_on_review_of_review: values.emailPreferences.includes(
      EmailPreference.EMAIL_ON_META_REVIEW
    ),
  };
  return JSON.stringify(user);
};

export const transformUserResponse = (user: IUserResponse) => {
  const userValues: IUserFormValues = {
    name: user.name,
    email: user.email,
    firstName: user.fullName.split(",")[1].trim(),
    lastName: user.fullName.split(",")[0].trim(),
    role_id: user.role.id,
    parent_id: user.parent.id,
    institution_id: user.institution.id,
    emailPreferences: [],
  };
  if (user.email_on_review) {
    userValues.emailPreferences.push(EmailPreference.EMAIL_ON_REVIEW);
  }
  if (user.email_on_submission) {
    userValues.emailPreferences.push(EmailPreference.EMAIL_ON_SUBMISSION);
  }
  if (user.email_on_review_of_review) {
    userValues.emailPreferences.push(EmailPreference.EMAIL_ON_META_REVIEW);
  }
  return userValues;
};
