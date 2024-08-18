import toast from "react-hot-toast";
import ExclamationIcon from "~/components/icons/Exclamation";

export const errorToast = (title: string, message: string) => {
  return toast(
    (t) => (
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-1">
          <ExclamationIcon className="size-6 text-red-500" />
          <h4 className="text-red-500 font-montserrat font-semibold text-lg">
            {title}
          </h4>
        </div>
        <span className="font-nunito text-slate-800">{message}</span>
      </div>
    ),
    {
      id: "error-toast",
      className: "border-b-[6px] border-red-500 rounded-2xl",
    }
  );
};
export const successToast = (title: string, message: string) => {
  return toast(
    (t) => (
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-1">
          <ExclamationIcon className="size-6 text-green-500" />
          <h4 className="text-green-500 font-montserrat font-semibold text-lg">
            {title}
          </h4>
        </div>
        <span className="font-nunito text-slate-800">{message}</span>
      </div>
    ),
    {
      id: "error-toast",
      className: "border-b-[6px] border-green-500 rounded-2xl",
    }
  );
};
