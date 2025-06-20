import React, { useEffect, useRef } from "react";
import masaiLogo from '/src/assets/masai.svg';
import nsdcLogo from '/src/assets/nsdc.svg';
import iitmandiLogo from '/src/assets/iitmandi.svg';
import cceLogo from '/src/assets/cce.svg';

const CreateAccountOtp = ({ form, onChange, onNext, onBack, editField, setEditField }) => {
  const emailRef = useRef();
  const phoneRef = useRef();

  useEffect(() => {
    if (editField === "email" && emailRef.current) {
      emailRef.current.focus();
      setEditField(null);
    }
    if (editField === "phone" && phoneRef.current) {
      phoneRef.current.focus();
      setEditField(null);
    }
  }, [editField, setEditField]);

  return (
    <div className="w-full relative bg-[#eee0fe] h-[100vh] overflow-hidden text-left text-sm text-[#1d1b20] font-roboto">
      <div className="absolute top-[calc(50%_-_235px)] left-[calc(50%_-_171.5px)] backdrop-filter-blur-[34px] rounded-3xl bg-[linear-gradient(180deg,#fff_15.87%,rgba(255,255,255,0)_65.87%),rgba(255,255,255,0.2)] border-solid border-[1px] box-border w-[343px] flex flex-col items-center justify-start py-6 px-4 gap-8 text-[28px] text-[#222] font-poppins border-[rgba(255,255,255,0.8)]">
        <div className="h-[44.8px] flex flex-row items-center justify-center gap-4">
          <img src={cceLogo} alt="CCE" />
          <img src={iitmandiLogo} alt="IIT Mandi" />
          <img src={nsdcLogo} alt="NSDC" />
          <img src={masaiLogo} alt="Masai" />
        </div>
        <form
          className="self-stretch flex flex-col items-center justify-start gap-8"
          onSubmit={e => { e.preventDefault(); onNext(); }}
        >
          <div className="self-stretch flex flex-col items-center justify-start gap-3 font-inter">
            <div className="relative leading-[150%] font-semibold">Create Account</div>
            <div className="w-[287px] relative text-xs leading-[140%] text-[#454545] text-center inline-block font-poppins">
              <span>Access your </span>
              <span className="font-medium">CCE, </span>
              <span>IIT Mandi Minor Programs account by verifying both your <b>email</b> and <b>phone number</b>.</span>
            </div>
          </div>
          <div className="self-stretch flex flex-col items-start justify-start gap-4 text-xs text-[#555]">
            <div className="self-stretch flex flex-col items-start justify-start gap-1.5">
              <div className="relative leading-[120%]">Email</div>
              <input
                ref={emailRef}
                type="email"
                value={form.email}
                onChange={e => onChange("email", e.target.value)}
                placeholder="Enter your email address"
                className="self-stretch rounded-lg bg-[#fff] border-[#d9d9d9] border-solid border-[1px] box-border py-3 px-4 min-w-[240px] leading-[140%] outline-none"
                required
              />
            </div>
            <div className="self-stretch flex flex-col items-start justify-start gap-1">
              <div className="relative leading-[120%]">Phone number</div>
              <input
                ref={phoneRef}
                type="tel"
                value={form.phone}
                onChange={e => onChange("phone", e.target.value)}
                placeholder="Enter your phone number"
                className="self-stretch rounded-lg bg-[#fff] border-[#d9d9d9] border-solid border-[1px] box-border py-3 px-4 min-w-[240px] leading-[140%] outline-none"
                required
              />
            </div>
          </div>
          <div className="flex flex-row gap-2 w-full">
            <button
              className="flex-1 rounded-lg bg-[linear-gradient(95.11deg,#704ee7,#5f39e4)] text-[#fff] py-2.5 px-5 text-sm font-semibold"
              onClick={onBack}
              type="button"
            >
              Back
            </button>
            <button
              className="flex-1 rounded-lg bg-[linear-gradient(95.11deg,#704ee7,#5f39e4)] text-[#fff] py-2.5 px-5 text-sm font-semibold"
              type="submit"
            >
              Send OTPs to Email & Phone
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAccountOtp;
