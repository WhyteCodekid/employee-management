import { Button } from "@nextui-org/react";
import { ActionFunction, LoaderFunction, redirect } from "@remix-run/node";
import { Form } from "@remix-run/react";
import TextInput from "~/components/inputs/text-input";
import UserController from "~/controllers/UserController";
import { getSession } from "~/utils/auth-session";

export default function Login() {
  return (
    <div className="grid grid-cols-2 h-screen">
      <div className=""></div>

      {/* login form */}
      <div className="h-full flex flex-col gap-5 items-center justify-center">
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
  const authSession = await getSession(request.headers.get("Cookie"));
  const token = authSession.get("token");

  // redirect if token exists
  if (token) {
    return redirect("/admin");
  }
  return {};
};
