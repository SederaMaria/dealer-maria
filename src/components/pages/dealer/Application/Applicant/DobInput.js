import React, { useState, useEffect } from "react";
import { Form, DatePicker } from "antd";
import MaskedInput from "antd-mask-input";
import moment from "moment";

export default function DobInput ({dateFormat, form, requireCoApplicantFields}) {

  const [dateString, setDateString] = useState(null);
  const [dateObj, setDateObj] = useState(null);
  const [calendarOpen, setCalendarOpen] = useState(false);

  
  const [dateOfBirthValidation, setDateOfBirthValidation] = useState(undefined);
  const [dateOfBirthValidationMessage, setDateOfBirthValidationMessage] = useState(undefined);
  const dateOfBirth = form.getFieldValue(['lesseeAttributes', 'dateOfBirth'])
  

  const onDatePickerChange = (momentObj) => {
    let dateString = moment(momentObj).format('MM/DD/YYYY');
    setDateObj(momentObj);
    setDateString(dateString);
    validateInput(dateString);
    form.setFieldsValue({ lesseeAttributes: { dateOfBirth: dateString } });
  }

  const onMaskedInputChange = (event) => {
    var date = moment(event.target.value, dateFormat, true);
    if (date.isValid()) {
      let dateString = date.format('MM/DD/YYYY');
      setDateObj(date);
      setDateString(dateString);
      validateInput(dateString);
      form.setFieldsValue({ lesseeAttributes: { dateOfBirth: dateString } });
    }
  }

  const validateInput = (dateString) => {
    setDateOfBirthValidation(undefined);
    setDateOfBirthValidationMessage(undefined);

    let age = Math.floor((new Date() - new Date(dateString).getTime()) / 3.15576e+10);

    if (age <= 18) {
      setDateOfBirthValidation("error");
      setDateOfBirthValidationMessage("Date of Birth must be 18 years old");
    }

    return age <= 18;
  }

  useEffect(() => {
    var date = moment(new Date(dateOfBirth ? dateOfBirth : null), dateFormat, true);
    let dateString = date.format('MM/DD/YYYY');
    // setDateObj(date);
    // setDateString(dateString);
    // validateInput(dateString);
    // setDateObj(form.getFieldValue(['lesseeAttributes', 'dateOfBirth']));
  }, []);

 
  return (
    <Form.Item
      label="Date of Birth (mm/dd/yyyy)"
      name={['lesseeAttributes', 'dateOfBirth']}
      // hasFeedback
      rules={[{ required: requireCoApplicantFields , message: 'Date of Birth is required!' }]}
      validateStatus={dateOfBirthValidation}
      help={dateOfBirthValidationMessage}
    >
      <DatePicker
        value={dateObj}
        open={calendarOpen}
        style={{ visibility: "hidden", width: 0, padding: 0, margin: "-1px"}}
        onChange={onDatePickerChange}
        format={dateFormat}
        showToday={false}
      />
      <MaskedInput
        className={"ant-input-comp"}
        value={dateString}
        mask="11/11/1111"
        placeholder="MM/DD/YYYY"
        onChange={onMaskedInputChange}
        onFocus={() => setCalendarOpen(!calendarOpen)}
        onBlur={() => setCalendarOpen(!calendarOpen)}
      />
    </Form.Item>
  )
}
