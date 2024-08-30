import { Button } from "@nextui-org/react";
import { ActionFunction, LoaderFunction } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import React from "react";
import TextInput from "~/components/inputs/text-input";
import Header from "~/components/ui/header";
import UserController from "~/controllers/UserController";

export default function AdminProfile() {
  const { user } = useLoaderData();
  return (
    <div className="flex  flex-col ">
      <Header title="Employees Leave Management" user={user} />

      <div className="items-center justify-center flex h-[90vh]">
        <Form
          method="POST"
          className="my-auto flex flex-col mx-auto w-[60%] gap-5"
        >
          <TextInput
            label="First Name"
            name="firstName"
            isRequired
            defaultValue={user?.firstName}
          />
          <TextInput
            label="Last Name"
            name="lastName"
            isRequired
            defaultValue={user?.lastName}
          />
          <TextInput
            label="Email"
            name="email"
            type="email"
            isRequired
            defaultValue={user?.email}
          />
          <TextInput
            label="Phone"
            name="phone"
            type="tel"
            isRequired
            defaultValue={user?.phone}
          />

          <Button type="submit" className="ml-auto mt-11">
            Update Profile
          </Button>
        </Form>
      </div>
    </div>
  );
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const formValues = Object.fromEntries(formData.entries());

  const userController = new UserController(request);
  return userController.updateMyProfile(formValues);
};

export const loader: LoaderFunction = async ({ request }) => {
  const adminControlle = new UserController(request);
  const user = await adminControlle.getUser();

  return { user };
};
