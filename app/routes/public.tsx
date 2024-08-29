import {
  Button,
  Chip,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  SelectItem,
  useDisclosure,
} from "@nextui-org/react";
import { ActionFunction, LoaderFunction } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import moment from "moment";
import { useState } from "react";
import FrostedNavbar from "~/components/frosted-topnav";
import CustomSelect from "~/components/inputs/select";
import TextInput from "~/components/inputs/text-input";
import JobController from "~/controllers/JobController";

export default function Public() {
  const { jobs } = useLoaderData();
  const [details, setDetails] = useState<any | null>(null);
  const [gender, setGender] = useState<string | null>(null);

  const detailsDisclosure = useDisclosure();

  return (
    <div className="">
      <FrostedNavbar />

      <section className="h-[94vh] px-11 flex items-center justify-center flex-col gap-5 bg-gradient-to-bl from-violet-400 to-purple-300">
        <p className="baskervville-sc-regular text-6xl font-semibold">
          Avaible Job
        </p>
        <p className="baskervville-sc-regular text-6xl font-semibold">
          Openings
        </p>

        <Form method="GET" className="flex gap-3 items-center">
          <input
            type="text"
            className="outline-none bg-white dark:bg-slate-900 px-9 p-3 rounded-3xl w-96 border"
            placeholder="Search for jobs..."
            name="search_term"
          />
          <Button
            className="bg-black text-white p-3 rounded-3xl"
            size="lg"
            href="#listings"
            type="submit"
          >
            Search
          </Button>
        </Form>
      </section>

      <section className="px-11 grid grid-cols-4 gap-5 mt-11" id="listings">
        {jobs?.map((job) => (
          <div
            key={job?._id}
            className="bg-slate-100 dark:bg-slate-800 flex flex-col rounded-xl p-1 h-80"
          >
            <div className="rounded-lg flex flex-col gap-3 bg-yellow-100 dark:bg-slate-700 h-full flex-1 p-3">
              <p className="bg-white dark:bg-slate-900 mr-auto rounded-xl py-1 px-3">
                {moment(job.createdAt).fromNow()}
              </p>

              <p className="text-4xl font-semibold">{job.title}</p>

              <p>{job.description}</p>
              <Chip
                className="capitalize mt-auto"
                variant="flat"
                color="secondary"
              >
                {job.commitment}
              </Chip>
            </div>

            <div className="flex items-center justify-between mt-4 p-3">
              <p className="text-lg font-semibold">GHc {job.salary} /mo </p>
              <Button
                size="sm"
                color="success"
                onClick={() => {
                  console.log("view details");
                  setDetails(job);
                  detailsDisclosure.onOpen();
                }}
              >
                Details
              </Button>
            </div>
          </div>
        ))}
      </section>

      <Modal
        isOpen={detailsDisclosure.isOpen}
        onOpenChange={detailsDisclosure.onOpenChange}
        isDismissable={false}
        isKeyboardDismissDisabled={true}
      >
        <ModalContent>
          {(onClose) => (
            <Form method="POST">
              <ModalHeader className="flex flex-col gap-1">
                {details?.title}
              </ModalHeader>
              <ModalBody>
                <p className="text-lg">{details?.description}</p>
                <p className="text-lg font-semibold">
                  GHc {details?.salary} /mo
                </p>
                <p className="text-lg font-semibold capitalize">
                  {details?.commitment}
                </p>

                <p className="text-lg font-semibold">
                  Created: {moment(details?.createdAt).fromNow()}
                </p>

                <div className="flex flex-col gap-3 mt-11">
                  <input type="hidden" name="id" value={details?._id} />
                  <input type="hidden" name="gender" value={gender} />
                  <TextInput name="fullName" label="Full Name" isRequired />
                  <TextInput
                    name="email"
                    label="Email"
                    type="email"
                    isRequired
                  />
                  <CustomSelect
                    label="Gender"
                    isRequired
                    selectedKeys={[gender]}
                    onChange={(e) => setGender(e.target.value)}
                  >
                    <SelectItem key={"male"}>Male</SelectItem>
                    <SelectItem key={"female"}>Female</SelectItem>
                  </CustomSelect>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" type="submit" onPress={onClose}>
                  Apply
                </Button>
              </ModalFooter>
            </Form>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const formValues = Object.fromEntries(formData.entries());

  const jobController = new JobController(request);

  return await jobController.applyJob({
    jobId: formValues.id as string,
    gender: formValues.gender as string,
    email: formValues.email as string,
    fullName: formValues.fullName as string,
    commitment: formValues.commitment as string,
  });
};

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const search_term = url.searchParams.get("search_term") || "";
  const page = parseInt(url.searchParams.get("page") || "1");

  const jobCtr = new JobController(request);
  const { jobs, totalPages } = await jobCtr.getJobs({
    page,
    search_term,
    limit: 15,
  });

  return {
    search_term,
    page,
    jobs,
    totalPages,
  };
};
