
import { TableContainer, Td, Tr, Button } from "@app/components/v2";
import { useToggle } from "@app/hooks";
import { faAngleUp, faEye, faEyeSlash, faKey, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { DeleteUserSecretConfirmationModal } from "./DeleteUserSecretConfirmation";


export const UserSecretOverviewTableRow = ({
  secretName,
  secretValue,
  id,
  secretType,
}:
  {
    secretName: string;
    secretValue: string;
    id: string;
    secretType: string;
  }
) => {
  const [isFormExpanded, setIsFormExpanded] = useToggle();
  const [isSecretVisible, setIsSecretVisible] = useToggle();
  const [secretValueJson, setSecretValueJson] = useState(JSON.parse(secretValue));
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const totalCols = 0;
  return (
    <>
      <Tr isHoverable isSelectable onClick={() => setIsFormExpanded.toggle()} className="group">
        <Td
          className={`sticky left-0 z-10 bg-mineshaft-800 bg-clip-padding py-0 px-0 group-hover:bg-mineshaft-700 ${isFormExpanded && "border-t-2 border-mineshaft-500"
            }`}
        >
          <div className="h-full w-full border-r border-mineshaft-600 py-2.5 px-5">
            <div className="flex items-center space-x-5">
              <div className="text-blue-300/70">
                <FontAwesomeIcon icon={isFormExpanded ? faAngleUp : faKey} />
              </div>
              <div title={secretName}>{secretName}</div>
              {/* Adding an empty div to take up remaining space */}
              <div className="flex-grow"></div>
              <div className="ml-auto mt-1 mr-1">
                <Button
                  variant="outline_bg"
                  colorSchema="danger"
                  leftIcon={<FontAwesomeIcon icon={faTrash} />}
                  className="ml-4"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsDeleteModalOpen(true);
                  }}
                  size="xs"
                >
                  Delete
                </Button>
              </div>
            </div>

          </div>
        </Td>
      </Tr>
      {isFormExpanded && (
        <Tr>
          <Td
            colSpan={totalCols}
            className={`bg-bunker-600 px-0 py-0 ${isFormExpanded && "border-b-2 border-mineshaft-500"
              }`}
          >
            <div
              className="ml-2 p-2"
            >
              {/* <SecretRenameRow
                secretKey={secretKey}
                environments={environments}
                secretPath={secretPath}
                getSecretByKey={getSecretByKey}
              /> */}

              <TableContainer>
                <table className="secret-table">
                  <thead>
                    <tr className="h-10 border-b-2 border-mineshaft-600">
                      <th
                        style={{ padding: "0.5rem 1rem" }}
                        className="min-table-row min-w-[11rem]"
                      >
                        Field
                      </th>
                      <th style={{ padding: "0.5rem 1rem" }} className="border-none">
                        Value
                      </th>
                      <div className="absolute top-0 right-0 ml-auto mt-1 mr-1 w-min">
                        <Button
                          variant="outline_bg"
                          className="p-1"
                          leftIcon={<FontAwesomeIcon icon={isSecretVisible ? faEyeSlash : faEye} />}
                          onClick={() => setIsSecretVisible.toggle()}
                        >
                          {isSecretVisible ? "Hide Values" : "Reveal Values"}
                        </Button>
                      </div>
                    </tr>
                  </thead>
                  <tbody className="border-t-2 border-mineshaft-600">
                    {
                      Object.keys(secretValueJson).map((key: any) => (
                        <tr key={key} className="h-10 border-b-2 border-mineshaft-600">
                          <td style={{ padding: "0.5rem 1rem" }} className="min-table-row min-w-[11rem]">
                            {key}
                          </td>
                          <td style={{ padding: "0.5rem 1rem" }}>
                            {isSecretVisible ? secretValueJson[key] : "********"}
                          </td>
                        </tr>
                      ))
                    }
                  </tbody>
                </table>
              </TableContainer>
            </div>
          </Td>
        </Tr>
      )}
      <>
        <DeleteUserSecretConfirmationModal id={id} open={isDeleteModalOpen} setOpen={setIsDeleteModalOpen} />
      </>
    </>
  );
};
