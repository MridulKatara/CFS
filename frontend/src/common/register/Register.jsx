import React, { useState } from "react";
import CreateAccountSave from "./CreateAccountSave";
import CreateAccountOtp from "./CreateAccountOtp";
import CreateAccountVerify from "./CreateAccountVerify";

const Register = () => {
  // All form data in one state object
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    name: "",
    university: "",
    password: "",
    confirmPassword: "",
    email: "",
    phone: "",
    emailOtp: "",
    phoneOtp: "",
  });

  // For edit navigation in verify step
  const [editField, setEditField] = useState(null);

  // Handlers to update form fields
  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // When editing from verify step, go back to OTP step and focus the field
  const handleEdit = (field) => {
    setEditField(field);
    setStep(1);
  };

  return (
    <>
      {step === 0 && (
        <CreateAccountSave
          form={form}
          onChange={handleChange}
          onNext={() => setStep(1)}
        />
      )}
      {step === 1 && (
        <CreateAccountOtp
          form={form}
          onChange={handleChange}
          onNext={() => setStep(2)}
          onBack={() => setStep(0)}
          editField={editField}
          setEditField={setEditField}
        />
      )}
      {step === 2 && (
        <CreateAccountVerify
          form={form}
          onChange={handleChange}
          onBack={() => setStep(1)}
          onEdit={handleEdit}
        />
      )}
    </>
  );
};

export default Register;
