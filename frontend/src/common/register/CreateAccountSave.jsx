import React from "react";
import masaiLogo from '/src/assets/masai.svg';
import nsdcLogo from '/src/assets/nsdc.svg';
import iitmandiLogo from '/src/assets/iitmandi.svg';
import cceLogo from '/src/assets/cce.svg';

const CreateAccountSave = ({ form, onChange, onNext }) => (
  <div className="w-full relative bg-[#eee0fe] h-[100vh] overflow-hidden text-left text-sm text-[#1d1b20] font-roboto">
    <div className="absolute top-[calc(50%_-_338px)] left-[calc(50%_-_171.5px)] backdrop-filter-blur-[34px] rounded-3xl bg-[linear-gradient(180deg,#fff_15.87%,rgba(255,255,255,0)_65.87%),rgba(255,255,255,0.2)] border-solid border-[1px] box-border w-[343px] flex flex-col items-center justify-start py-6 px-4 gap-8 text-[28px] text-[#222] font-poppins border-[rgba(255,255,255,0.8)]">
      <div className="h-[44.8px] flex flex-row items-center justify-center gap-4">
        <img src={cceLogo} alt="CCE" />
        <img src={iitmandiLogo} alt="IIT Mandi" />
        <img src={nsdcLogo} alt="NSDC" />
        <img src={masaiLogo} alt="Masai" />
      </div>
      <div className="self-stretch flex flex-col items-center justify-start">
        <form
          className="self-stretch flex flex-col items-start justify-start gap-4"
          onSubmit={e => { e.preventDefault(); onNext(); }}
        >
          <div className="self-stretch flex flex-col items-center justify-start font-inter">
            <div className="relative leading-[150%] font-semibold">Create Account</div>
          </div>
          <div className="self-stretch flex flex-col items-start justify-start gap-4 text-xs text-[#555]">
            {[
              { label: "Name", field: "name", placeholder: "Enter your name" },
              { label: "University Name", field: "university", placeholder: "Enter your university name" },
              { label: "Course", field: "course", placeholder: "Enter your course" },
              { label: "Branch", field: "branch", placeholder: "Enter your branch" },
              { label: "Create Password", field: "password", placeholder: "Create your password", type: "password" },
              { label: "Confirm Password", field: "confirmPassword", placeholder: "Confirm your password", type: "password" },
            ].map(({ label, field, placeholder, type }) => (
              <div key={field} className="self-stretch flex flex-col items-start justify-start gap-1.5">
                <div className="relative leading-[120%]">{label}</div>
                <div className="self-stretch flex flex-col items-start justify-start text-[#b3b3b3]">
                  <input
                    type={type || "text"}
                    value={form[field]}
                    onChange={e => onChange(field, e.target.value)}
                    placeholder={placeholder}
                    className="self-stretch rounded-lg bg-[#fff] border-[#d9d9d9] border-solid border-[1px] box-border py-3 px-4 min-w-[240px] leading-[140%] outline-none"
                    required
                  />
                </div>
              </div>
            ))}
          </div>
          <button
            className="self-stretch rounded-lg bg-[linear-gradient(95.11deg,#704ee7,#5f39e4)] overflow-hidden flex flex-row items-center justify-center py-2.5 px-5 text-sm text-[#fff] font-semibold mt-2"
            type="submit"
          >
            Save
          </button>
        </form>
      </div>
    </div>
  </div>
);

export default CreateAccountSave;
