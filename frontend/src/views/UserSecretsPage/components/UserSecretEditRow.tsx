import { Controller, useForm } from "react-hook-form";
import { faCheck, faCopy, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { createNotification } from "@app/components/notifications";
import { IconButton, Tooltip } from "@app/components/v2";
import { InfisicalSecretInput } from "@app/components/v2/InfisicalSecretInput";

type Props = {
  defaultValue?: string | null;
  fieldName: string;
  isVisible?: boolean;
  updateSecret: (field: string, fieldValue: string) => void;
};

export const SecretEdit = ({
  defaultValue,
  fieldName,
  isVisible,
  updateSecret,
}: Props) => {
  const {
    handleSubmit,
    control,
    reset,
    getValues,
    formState: { isDirty, isSubmitting }
  } = useForm({
    values: {
      value: defaultValue || null
    }
  });

  const handleFormReset = () => {
    reset();
  };


  
  const handleCopySecretToClipboard = async () => {
    const { value } = getValues();
    if (value) {
      try {
        await window.navigator.clipboard.writeText(value);
        createNotification({ type: "success", text: "Copied secret to clipboard" });
      } catch (error) {
        console.log(error);
        createNotification({ type: "error", text: "Failed to copy secret to clipboard" });
      }
    }
  };

  const handleFormSubmit = async ({ value }: { value?: string | null }) => {
    if ((value || value === "") && fieldName) {
		try {
		  updateSecret(
        fieldName,
        value
      )
		} catch (err) {
		  console.error(err);
		}
	  };
    reset({ value });
  };

  return (
    <div className="group flex w-full cursor-text items-center space-x-2">
      <div className="flex-grow border-r border-r-mineshaft-600 pr-2 pl-1">
        <Controller
          disabled={!defaultValue}
          control={control}
          name="value"
          render={({ field }) => (
            <InfisicalSecretInput
              {...field}
              value={field.value as string}
              key="secret-input"
              isVisible={isVisible}
            />
          )}
        />
      </div>
      <div
        className="flex w-16 justify-center space-x-3 pl-2 transition-all">
        {isDirty ? (
          <>
		  <div>
                  <Tooltip content="save">
                    <IconButton
                      variant="plain"
                      ariaLabel="submit-value"
                      className="h-full"
                      isDisabled={isSubmitting}
                      onClick={handleSubmit(handleFormSubmit)}
                    >
                      <FontAwesomeIcon icon={faCheck} />
                    </IconButton>
                  </Tooltip>
                </div>
              
            <div>
              <Tooltip content="cancel">
                <IconButton
                  variant="plain"
                  colorSchema="danger"
                  ariaLabel="reset-value"
                  className="h-full"
                  onClick={handleFormReset}
                  isDisabled={isSubmitting}
                >
                  <FontAwesomeIcon icon={faXmark} className="hover:text-red" />
                </IconButton>
              </Tooltip>
            </div>
          </>
        ) : (
          <>
            <div className="opacity-0 group-hover:opacity-100">
              <Tooltip content="Copy Secret">
                <IconButton
                  ariaLabel="copy-value"
                  onClick={handleCopySecretToClipboard}
                  variant="plain"
                  className="h-full"
                >
                  <FontAwesomeIcon icon={faCopy} />
                </IconButton>
              </Tooltip>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

