import { useState } from "react";
import {
  faArrowDown,
  faArrowUp,
  faFolderBlank,
  faPlus
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import NavHeader from "@app/components/navigation/NavHeader";
import { Button, EmptyState, IconButton, TBody, TFoot, THead, Table, TableContainer, Td, Th, Tr } from "@app/components/v2";
import { CreateUserSecretForm } from "./components/CreateUserSecretForm";
import { useGetUserSecrets } from "@app/hooks/api/userSecrets";
import { UserSecretOverviewTableRow } from "./components/UserSecretOverviewTableRow";

export const UserSecretsPage = () => {
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const { isSuccess, data: userSecrets, error } = useGetUserSecrets();
  const [isTableEmpty] = useState<Boolean>(error ? true : false);
  const [isCreateUserSecretsOpen, setIsCreateUserSecretsOpen] = useState<boolean>(false);

  return (
    <>
      <div className="container mx-auto px-6 text-mineshaft-50 dark:[color-scheme:dark]">
        <div className="relative right-5 ml-4">
          <NavHeader pageName={"User Secrets"} />
        </div>
        <div className="space-y-8">
          <div className="mt-6">
            <p className="text-3xl font-semibold text-bunker-100">User Local Secrets</p>
            <p className="text-md text-bunker-300">
              Store your local secrets safely using infisical.
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex flex-row items-center justify-center space-x-2">
          </div>
          <div className="flex items-center justify-between">
            <div className="flex flex-row items-center justify-center space-x-2">
              <div>
                <Button
                  variant="outline_bg"
                  leftIcon={<FontAwesomeIcon icon={faPlus} />}
                  className="h-10 rounded-r-none"
                  onClick={() => { setIsCreateUserSecretsOpen(true) }}
                >
                  Add Secret
                </Button>
              </div>
            </div>
          </div>
        </div>


        <div className="thin-scrollbar mt-4">
          <TableContainer className="max-h-[calc(100vh-250px)] overflow-y-auto">
            <Table>
              <THead>
                <Tr className="sticky top-0 z-20 border-0">
                  <Th className="sticky left-0 z-20 min-w-[30rem] border-b-0 p-0">
                    <div className="flex items-left border-b border-r border-mineshaft-600 px-5 pt-3.5 pb-3">
                      Secret Name
                      <IconButton
                        variant="plain"
                        className="ml-2"
                        ariaLabel="sort"
                        onClick={() => setSortDir((prev) => (prev === "asc" ? "desc" : "asc"))}
                      >
                        <FontAwesomeIcon icon={sortDir === "asc" ? faArrowDown : faArrowUp} />
                      </IconButton>
                    </div>
                  </Th>
                </Tr>
              </THead>
              <TBody>
                {(isTableEmpty === true) && (
                    <Tr>
                      <Td colSpan={1}>
                        <EmptyState
                          title={
                            "Let's add some secrets"
                          }
                          icon={faFolderBlank}
                          iconSize="3x"
                        >
                          <Button
                            className="mt-4"
                            variant="outline_bg"
                            colorSchema="primary"
                            size="md"
                            onClick={() => { setIsCreateUserSecretsOpen(true) }}
                          >
                            Add Secret
                          </Button>
                        </EmptyState>
                      </Td>
                    </Tr>
                )}

                {isSuccess === true && userSecrets.map(({ secretName, secretValue, id, secretType }) => (
                  <UserSecretOverviewTableRow
                    secretName={secretName}
                    secretValue={secretValue}
                    id={id}
                    secretType={secretType}
                  />
                ))}
              </TBody>
              <TFoot>
                <Tr className="sticky bottom-0 z-10 border-0 bg-mineshaft-800">
                  <Td className="sticky left-0 z-10 border-0 bg-mineshaft-800 p-0">
                    <div
                      className="w-full border-t border-r border-mineshaft-600"
                      style={{ height: "45px" }}
                    />
                  </Td>
                </Tr>
              </TFoot>
            </Table>
          </TableContainer>
        </div>
      </div>
      <CreateUserSecretForm open={isCreateUserSecretsOpen} setOpen={setIsCreateUserSecretsOpen} />
    </>
  );
};
