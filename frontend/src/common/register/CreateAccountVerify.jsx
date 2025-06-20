import React from "react";
import masaiLogo from '/src/assets/masai.svg';
import nsdcLogo from '/src/assets/nsdc.svg';
import iitmandiLogo from '/src/assets/iitmandi.svg';
import cceLogo from '/src/assets/cce.svg';

const CreateAccountVerify = ({ form, onChange, onBack, onEdit }) => (
  <div className="w-full relative bg-[#eee0fe] h-[100vh] overflow-hidden text-left text-sm text-[#1d1b20] font-roboto">
    <div className="absolute top-[calc(50%_-_258px)] left-[calc(50%_-_171.5px)] backdrop-filter-blur-[34px] rounded-3xl bg-[linear-gradient(180deg,#fff_15.87%,rgba(255,255,255,0)_65.87%),rgba(255,255,255,0.2)] border-solid border-[1px] box-border w-[343px] flex flex-col items-center justify-start py-6 px-4 gap-8 text-[28px] text-[#222] font-poppins border-[rgba(255,255,255,0.8)]">
      <div className="h-[44.8px] flex flex-row items-center justify-center gap-4">
        <img src={cceLogo} alt="CCE" />
        <img src={iitmandiLogo} alt="IIT Mandi" />
        <img src={nsdcLogo} alt="NSDC" />
        <img src={masaiLogo} alt="Masai" />
      </div>
      <form
        className="self-stretch flex flex-col items-center justify-start gap-5"
        onSubmit={e => { e.preventDefault(); /* handle verify here */ }}
      >
        <div className="self-stretch flex flex-col items-center justify-start gap-3 font-inter">
          <div className="relative leading-[150%] font-semibold">Create Account</div>
          <div className="self-stretch relative text-xs leading-[150%] text-center">
            <p className="m-0">
              <span className="font-poppins text-[#1d1b20]">
                Enter the OTP's sent to Phone <b className="text-[#222]">{form.phone ? `+91 XXXXX${form.phone.slice(-4)}` : ""}</b>
              </span>
              <span
                className="font-medium font-poppins [text-decoration:underline] text-blueviolet cursor-pointer ml-1"
                onClick={() => onEdit("phone")}
              >
                edit
              </span>
            </p>
            <p className="m-0">
              <span className="text-[#1d1b20] font-poppins">Email </span>
              <span className="font-semibold font-poppins text-[#222]">{form.email}</span>
              <span
                className="font-medium font-poppins [text-decoration:underline] text-blueviolet cursor-pointer ml-1"
                onClick={() => onEdit("email")}
              >
                edit
              </span>
            </p>
          </div>
        </div>
        <div className="self-stretch flex flex-col items-start justify-start gap-4 text-xs text-[#555]">
          <div className="self-stretch flex flex-col items-start justify-start gap-1.5">
            <div className="relative leading-[120%]">Email OTP</div>
            <input
              type="text"
              value={form.emailOtp}
              onChange={e => onChange("emailOtp", e.target.value)}
              placeholder="Enter your email OTP"
              className="self-stretch rounded-lg bg-[#fff] border-[#d9d9d9] border-solid border-[1px] box-border py-3 px-4 min-w-[240px] leading-[140%] outline-none"
              required
            />
          </div>
          <div className="self-stretch flex flex-col items-start justify-start gap-1">
            <div className="relative leading-[120%]">Phone OTP</div>
            <input
              type="text"
              value={form.phoneOtp}
              onChange={e => onChange("phoneOtp", e.target.value)}
              placeholder="Enter your phone number OTP"
              className="self-stretch rounded-lg bg-[#fff] border-[#d9d9d9] border-solid border-[1px] box-border py-3 px-4 min-w-[240px] leading-[140%] outline-none"
              required
            />
          </div>
        </div>
        <div className="flex flex-row gap-2 w-full mt-4">
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
            Verify
          </button>
        </div>
        <div className="relative text-xs leading-[170%] text-center text-[#555] mt-2">
          <p className="m-0">{`Didn't get the OTP? `}</p>
          <p className="m-0 text-[#603ae4]">
            <span className="font-medium">
              <span className="text-[#603ae4] [text-decoration:underline] cursor-pointer">Resend email OTP</span>
              <span className="text-[#555]">{` | `}</span>
              <span className="text-[#603ae4] [text-decoration:underline] cursor-pointer">Resend Phone OTP</span>
            </span>
          </p>
        </div>
      </form>
    </div>
  </div>
);

export default CreateAccountVerify;
