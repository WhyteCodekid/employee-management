import { Button } from "@nextui-org/react";
import { ActionFunction, LoaderFunction, redirect } from "@remix-run/node";
import { Form } from "@remix-run/react";
import TextInput from "~/components/inputs/text-input";
import UserController from "~/controllers/UserController";
import banner from "~/assets/images/login-banner.jpeg";

export default function Login() {
  return (
    <div className="grid grid-cols-2 h-screen">
      <div className="flex items-center justify-center">
        <img src={banner} className="h-[100vh] object-cover" alt="" />
      </div>

      {/* login form */}
      <div className="h-full flex flex-col gap-5 items-center justify-center">
        <h2 className="text-3xl font-semibold baskervville-sc-regular">
          Advanced Employee Manaement System
        </h2>
        <h2 className="text-3xl font-semibold mb-28 baskervville-sc-regular">
          (AEMS)
        </h2>
        <h1 className="font-montserrat font-bold text-lg">
          Sign In To Your Account
        </h1>

        <Form
          id="login-form"
          method="post"
          className="w-1/2 flex flex-col gap-5"
        >
          <TextInput name="email" label="Email" type="email" isRequired />
          <TextInput name="password" label="Password" type="password" />
          <Button
            color="success"
            className="font-montserrat font-medium text-white"
            type="submit"
            form="login-form"
          >
            Login
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
  return await userController.loginUser({
    email: formValues.email as string,
    password: formValues.password as string,
  });
};

export const loader: LoaderFunction = async ({ request }) => {
  const adminController = new UserController(request);
  return (await adminController.getUserId()) ? redirect("/admin") : null;
};
