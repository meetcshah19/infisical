import { useState } from "react";

import { Button, FormControl, Input, Modal, ModalContent, Select, SelectItem, TextArea } from "@app/components/v2";
import { useCreateUserSecret } from "@app/hooks/api/userSecrets";

export const CreateUserSecretForm = (
  {
    open,
    setOpen
  }: {
    open: boolean;
    setOpen: (open: boolean) => void;
  }
) => {
  const [selectedType, setSelectedType] = useState("login_credentials");
  const [secretName, setSecretName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [cvv, setCvv] = useState("");

  const { mutateAsync: createUserSecret } = useCreateUserSecret();

  const handleSubmit = async () => {
    try {
      let secretValue;
      switch (selectedType) {
        case "login_credentials":
          secretValue = JSON.stringify({ username, password })
          break;
        case "note":
          secretValue = JSON.stringify({ title, content })
          break;
        case "card":
          secretValue = JSON.stringify({ cardNumber, expirationDate, cvv })
          break;
        default:
          throw new Error("Invalid secret type");
      }

      await createUserSecret({
        secretName,
        secretValue,
        secretType: selectedType
      });

      setOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Modal
      isOpen={open}
    >
      <ModalContent className="max-h-[80vh] overflow-y-auto"
        title="Create User Secret" onClose={() => { setOpen(false); }}>
        <div className="flex flex-col space-y-4">
          <FormControl label="Secret Name">
            <Input className="input" onKeyUp={(v) => { setSecretName(v.target.value) }} />
          </FormControl>
          <FormControl label="Type">
            <div>
              <Select className="input" value={selectedType} onValueChange={(val) => setSelectedType(val)}>
                <SelectItem value="login_credentials">Login Credentials</SelectItem>
                <SelectItem value="note">Secure Note</SelectItem>
                <SelectItem value="card">Card</SelectItem>
              </Select>
            </div>
          </FormControl>
        </div>
        {
          selectedType === "login_credentials" && (
            <div>
              <FormControl label="Username">
                <Input className="input" onKeyUp={(v) => { setUsername(v.target.value) }} />
              </FormControl>
              <FormControl label="Password">
                <Input className="input" type="password" onKeyUp={(v) => { setPassword(v.target.value) }} />
              </FormControl>
            </div>
          )
        }
        {
          selectedType === "note" && (
            <div>
              <FormControl label="Title">
                <TextArea className="input" onKeyUp={(v) => { setTitle(v.target.value) }} />
              </FormControl>
              <FormControl label="Content">
                <TextArea className="input" onKeyUp={(v) => { setContent(v.target.value) }} />
              </FormControl>
            </div>
          )
        }
        {
          selectedType === "card" && (
            <div>
              <FormControl label="Card Number">
                <Input className="input" onKeyUp={(v) => { setCardNumber(v.target.value) }} />
              </FormControl>
              <FormControl label="Expiration Date">
                <Input className="input" onKeyUp={(v) => { setExpirationDate(v.target.value) }} />
              </FormControl>
              <FormControl label="CVV" >
                <Input className="input" onKeyUp={(v) => { setCvv(v.target.value) }} />
              </FormControl>
            </div>
          )
        }

        {/* submit */}
        <div className="flex justify-end">
          <Button
            onClick={() => {
              handleSubmit();
              setOpen(false);
            }}
          >
            Create
          </Button>
        </div>
      </ModalContent>
    </Modal>
  );
};