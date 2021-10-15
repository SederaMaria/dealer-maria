import React, { useState, useEffect, useRef } from 'react';
import { Input } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';


export default function SsnInput({defaultValue, form, lesseeType}) {

    const [actualSsn, setActualSsn] = useState(defaultValue)
    const [actualDashedSsn, setActualDashedSsn] = useState(defaultValue)
    const [maskedSsn, setMaskedSsn] = useState(defaultValue)
    const [toMask, setToMask] = useState(true)
    const inputSsnRef = useRef();
    const [inputSelectionStart, setInputSelectionStart] = useState(0);

    useEffect(() => {
        setMaskedSsn(starredMask(defaultValue))
        setActualDashedSsn(dashedActual(defaultValue))
      }, []);


    useEffect(() => {
        inputSsnRef.current.input.setSelectionRange(inputSelectionStart, inputSelectionStart, 'backward');
    });

    const handleChange = (e) => {
        const prevValue = maskedSsn;
        let actual = actualSsn;
        const newValue = e.target.value;
        var selectionStart = e.target.selectionStart
        
        if (newValue.length > 11) {
            return;
         }
        // typing forward
        if (newValue.length > prevValue.length) {
            if ([4,7].includes(selectionStart)){
              setInputSelectionStart(e.target.selectionStart + 1)
            }else{
              setInputSelectionStart(e.target.selectionStart)
            }
            actual = writeStr(actualDashedSsn, newValue[selectionStart-1], selectionStart-1).replace(/-/g, "")
            setSnnState(actual)
        }
    }   


    const toggleMask = () => {
        setToMask(!toMask)
    }


    const starredMask = (ssn, showLast4 = true) => {
        // replace numeric digits with * asterisk
        let valueHidden = ssn.replace(/[\d]/g, "*");
    
        if (valueHidden.length <= 3) {
          return valueHidden;
        }
    
        if (valueHidden.length <= 5) {
          return valueHidden.slice(0, 3) + "-" + valueHidden.slice(3, 5);
        }
    
        if (showLast4) {
          return (
            valueHidden.slice(0, 3) +
            "-" +
            valueHidden.slice(3, 5) +
            "-" +
            ssn.substr(5)
          );
        } else {
          return (
            valueHidden.slice(0, 3) +
            "-" +
            valueHidden.slice(3, 5) +
            "-" +
            valueHidden.slice(5, 9)
          );
        }
      }



      const dashedActual = (ssn) => {
        // replace numeric digits with * asterisk plus dash
        let valueHidden = ssn;
    
        if (valueHidden.length <= 3) {
          return valueHidden;
        }
    
        if (valueHidden.length <= 5) {
          return valueHidden.slice(0, 3) + "-" + valueHidden.slice(3, 5);
        }
    
        return (
            valueHidden.slice(0, 3) +
            "-" +
            valueHidden.slice(3, 5) +
            "-" +
            valueHidden.slice(5, 9)
        );
        
      }

      const  getCaretPosition = (control) => {
        var position = {};
        position.start = control.selectionStart;
        position.end = control.selectionEnd;
        position.length = position.end - position.start;
        return position;
      }

      const handleDashDelete = (selectionStart) => {
        setInputSelectionStart(selectionStart)
        setTimeout(() => {
          inputSsnRef.current.input.setSelectionRange(selectionStart, selectionStart, 'backward');
        }, 100, selectionStart);
      }


      const handleDelete = (e) => {
        
        if (window.getSelection().toString() === "-"){
          setInputSelectionStart(e.target.selectionStart)
          handleDashDelete(e.target.selectionStart)
          return;
        }

        var selection = getCaretPosition(e.target);
        if((e.keyCode===8 || e.keyCode===46) && selection.start!==selection.end){
          let actual = deleteStr(actualDashedSsn, selection.start, selection.end).replace(/-/g, "")
          setInputSelectionStart(selection.end-1)
          setSnnState(actual)
          setTimeout(() => {
            inputSsnRef.current.input.setSelectionRange(selection.end-selection.length, selection.end-selection.length, 'backward');
          }, 100);
        } else if(e.keyCode===8){
            let actual = deleteStr(actualDashedSsn, selection.start-1, selection.end).replace(/-/g, "")
            setInputSelectionStart(e.target.selectionStart-1)
            setSnnState(actual)
            setTimeout(() => {
              inputSsnRef.current.input.setSelectionRange((selection.end-selection.length)-1, (selection.end-selection.length)-1, 'backward');
            }, 100);
        } else if(e.keyCode===46){
          let actual = deleteStr(actualDashedSsn, selection.start, selection.end+1).replace(/-/g, "")
          setInputSelectionStart(e.target.selectionStart)
          setSnnState(actual)
        }
        return;

      }

      const deleteStr = (str, from, to) => {
        return str.substring(0, from) + str.substring(to);
      }

      const writeStr = (str, newStr, index) => {
        return str.substring(0, index) + newStr + str.substring(index, str.length);
      }

      const setFormSnn = (ssn) => {
        if (lesseeType ===  "lessee"){
          form.setFieldsValue({
            lesseeAttributes: {ssn: ssn}
          })
        }else{
          form.setFieldsValue({
            colesseeAttributes: {ssn: ssn}
          })
        }
      }

      const setSnnState = (ssn) => {
        setFormSnn(dashedActual(ssn))
        setActualSsn(ssn)
        setActualDashedSsn(dashedActual(ssn))
        setMaskedSsn(starredMask(ssn))
      }


      const handleHighlightedDeleteInput = (e) => {

        setInputSelectionStart(e.target.selectionStart)
        if (e.target.selectionStart !== undefined && e.target.selectionEnd !== undefined ){
          let selection = getCaretPosition(e.target, window.getSelection());
          let actual = deleteStr(actualDashedSsn, selection.start, selection.end).replace(/-/g, "")
          setSnnState(actual)
        }

      }


    return (
        <Input 
          placeholder="Social Security Number"
          value={toMask ? maskedSsn : actualDashedSsn} 
          ref={inputSsnRef}  
          onKeyDown={(e) => { 
              if (e.key === 'Backspace' || e.key === 'Delete' ) { 
                handleDelete(e)
              }else{
                let arrows = [
                  'ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp', 'Meta', 'Alt', 'Control', 'Shift', 'CapsLock', 'Tab', 'Escape',
                  'F1', 'F2', 'F3', 'F4', 'F5', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12'
                ]
                if (!arrows.includes(e.key )){
                  handleHighlightedDeleteInput(e)
                }
              }
            }
          } 
          onChange={e => { handleChange(e) } } 
          suffix={ toMask ? <EyeInvisibleOutlined onClick={toggleMask} /> : <EyeTwoTone onClick={toggleMask} /> } 
        />
    )
}