import CustomDropdown from "@/components/Common/CustomDropdown/CustomDropdown";
import DefaultLayout from "@/components/Common/DefaultLayout.jsx/DefaultLayout";
import React from "react";

export default function GetInTouchForm() {
  return (
    <div>
      <DefaultLayout styling={"py-[64px] lg:py-[112px]"}>
        <div className="text-center mb-12 lg:mb-20">
          <span className="text-base font-bold  leading-[150%] block mb-2 lg:mb-4">
            Connect
          </span>
          <h3 className="leading-[120%] tracking-[-1%] font-[400] text-[32px] lg:text-[40px]">
            Get In Touch
          </h3>

          <p className="text-base  tracking-[0%] leading-[150%] mt-5 lg:text-lg">
            We'd love to hear from you!
          </p>
        </div>

        {/* form  */}
        <form className="grid grid-cols-2 gap-6 getInTouchForm max-w-[768px] mx-auto">
          {/* First Name */}
          <div className="">
            <label htmlFor="">First Name</label>
            <input type="text" className="" />
          </div>

          {/* Last Name */}
          <div className="">
            <label htmlFor="">Last Name</label>
            <input type="text" className="" />
          </div>

          {/* Email */}
          <div className="col-span-2 lg:col-span-1">
            <label htmlFor="">Email</label>
            <input type="text" className="" />
          </div>

          {/* Phone */}
          <div className="col-span-2 lg:col-span-1">
            <label htmlFor="">Phone Number</label>
            <input type="text" className="" />
          </div>

          <div className="col-span-2">
            <label htmlFor="">Select Topic</label>
            <CustomDropdown options={options} placeholder="Choose something" />
          </div>

          <div className="col-span-2">
            <label htmlFor="">Your Role</label>
            <div className="grid grid-cols-2 gap-[14px]">
              {roles.map((role) => (
                <div key={role.id} className="flex items-center gap-[14px]">
                  <label className="radio-wrapper">
                    <input id={role.id} type="radio" name="yourRole" />
                    <span className="custom-radio"></span>
                    <span className="ms-3">{role.label}</span>
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="col-span-2">
            <label htmlFor="">Message</label>
            <textarea
              type="text"
              className="min-h-[180px]"
              placeholder="write your message..."
            />
          </div>

          <div className="">
            <label className="checkbox-wrapper flex items-center">
              <input type="checkbox" name="interest" value="news" />
              <span className="custom-checkbox"></span>
              <span className="pl-3 -mt-1">I agree to Terms</span>
            </label>
          </div>
          <div className="col-span-2">
            <div className="mx-auto primaryBtnPurple text-white w-fit">
              Submit
            </div>
          </div>
        </form>
      </DefaultLayout>
    </div>
  );
}

const options = [
  { label: "Option One", value: "1" },
  { label: "Option Two", value: "2" },
  { label: "Option Three", value: "3" },
];

const roles = [
  { id: "Athlete/Team", label: "Athlete/Team" },
  { id: "FanSupporter", label: "Fan Supporter" },
  { id: "otherInquiry", label: "Other Inquiry" },
  { id: "brandPartner", label: "Brand Partner" },
  { id: "mediaInquiry", label: "Media Inquiry" },
  { id: "other", label: "Other" },
];
