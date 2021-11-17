import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import Link from "next/link";
import { yupResolver } from "@hookform/resolvers/yup";
// import { Button, Input, Modal, notification } from "antd";
import { Input, Button, Text } from "@chakra-ui/react";
import { useToast, useDisclosure } from "@chakra-ui/react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { signIn } from "next-auth/client";
import axios from "axios";
import * as yup from "yup";
import { useMutation } from "react-query";
import SiteLayout from "@/layouts/SiteLayout";

const schema = yup.object().shape({
  email: yup.string().email(),
  firstName: yup.string().required("Please enter a first name"),
  lastName: yup.string().required("Please enter a last name"),
  password: yup.string().required("Password is required"),
  passwordConfirmation: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords need to match"),
});

export default function CreateAccount() {
  const {
    formState: { errors, isSubmitting, isDirty, isValid },
    getValues,
    handleSubmit,
    control,
  } = useForm({
    resolver: yupResolver(schema),
  });
  const [status, setStatus] = useState("");
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [submitError, setSubmitError] = useState();

  // ===========================================================================
  // Mutations
  // ===========================================================================
  const userMutation = useMutation(
    async (data) => {
      const { email, firstName, lastName, password } = data;
      const response = await axios.post("/api/register", {
        payload: {
          email,
          password: password,
          firstName: firstName,
          lastName: lastName,
          role: "user",
        },
      });

      if (response.status === 200) {
        success();
      }
    },
    {
      onSuccess: (data) => {
        onOpen();
      },
      onError: (error) => {
        let notificationMessage = "Error with registering";
        if (error.response) {
          if (error.response.data.message) {
            notificationMessage = error.response.data.message;
          }
        }
        setSubmitError(notificationMessage);
        toast({
          title: notificationMessage,
          status: "error",
          isClosable: true,
        });
      },
    }
  );

  // ===========================================================================
  // Functions
  // ===========================================================================
  async function onSubmit(data) {
    userMutation.mutate(data);
  }

  function success() {
    onOpen();
  }

  // ===========================================================================
  // Render
  // ===========================================================================
  return (
    <div className="container">
      <style jsx>{`
        .container {
          width: 400px;
          margin-left: auto;
          margin-right: auto;
          margin-top: 1rem;
        }
      `}</style>
      <h2>Create Account</h2>
      <div className="mt2">
        <label>Email</label>
        <Controller
          name="email"
          control={control}
          defaultValue=""
          type="email"
          render={({
            field: { onChange, onBlur, value, name, ref },
            fieldState: { invalid, isTouched, isDirty, error },
            formState,
          }) => {
            return (
              <>
                <Input type="email" onChange={onChange} value={value} />
                <Text fontSize="sm" color="tomato" className="sentenceCase">
                  {errors.email?.message}
                </Text>
              </>
            );
          }}
        />
      </div>
      <div className="mt2">
        <label>First name</label>
        <Controller
          name="firstName"
          control={control}
          defaultValue=""
          type="firstName"
          render={({
            field: { onChange, onBlur, value, name, ref },
            fieldState: { invalid, isTouched, isDirty, error },
            formState,
          }) => {
            return (
              <>
                <Input type="text" onChange={onChange} value={value} />
                <Text fontSize="sm" color="tomato" className="sentenceCase">
                  {errors.firstName?.message}
                </Text>
              </>
            );
          }}
        />
      </div>
      <div className="mt2">
        <label>Last name</label>
        <Controller
          name="lastName"
          rules={{ required: true }}
          control={control}
          defaultValue=""
          type="lastName"
          render={({
            field: { onChange, onBlur, value, name, ref },
            fieldState: { invalid, isTouched, isDirty, error },
            formState,
          }) => {
            return (
              <>
                <Input type="text" onChange={onChange} value={value} />
                <Text fontSize="sm" color="tomato" className="sentenceCase">
                  {errors.lastName?.message}
                </Text>
              </>
            );
          }}
        />
      </div>
      <div className="mt2">
        <label>Password</label>
        <Controller
          name="password"
          rules={{ required: true }}
          control={control}
          defaultValue=""
          render={({
            field: { onChange, onBlur, value, name, ref },
            fieldState: { invalid, isTouched, isDirty, error },
            formState,
          }) => {
            return (
              <>
                <Input type="password" onChange={onChange} value={value} />
                <Text fontSize="sm" color="tomato" className="sentenceCase">
                  {errors.password?.message}
                </Text>
              </>
            );
          }}
        />
      </div>
      <div className="mt2">
        <label>Password Confirmation</label>
        <Controller
          name="passwordConfirmation"
          rules={{
            required: true,
            validate: (val) => val === getValues("password"),
          }}
          control={control}
          defaultValue=""
          render={({
            field: { onChange, onBlur, value, name, ref },
            fieldState: { invalid, isTouched, isDirty, error },
            formState,
          }) => {
            return (
              <>
                <Input type="password" onChange={onChange} value={value} />
                <Text fontSize="sm" color="tomato" className="sentenceCase">
                  {errors.passwordConfirmation?.message}
                </Text>
              </>
            );
          }}
        />
      </div>
      <Button
        className="mt4"
        onClick={handleSubmit(onSubmit)}
        // disabled={!isDirty || !isValid}
      >
        Submit
      </Button>
      <Text size="sm" color="red">
        {submitError}
      </Text>

      <Modal isOpen={isOpen}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Registration Successful</ModalHeader>
          <ModalCloseButton />
          <ModalBody>You can now sign in.</ModalBody>

          <ModalFooter>
            <Link href="/signin">
              <Button colorScheme="blue" mr={3}>
                Sign in
              </Button>
            </Link>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}

CreateAccount.getLayout = (page) => <SiteLayout>{page}</SiteLayout>;
