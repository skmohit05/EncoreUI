import _ from "lodash";

// const URL_REGEXP = /^(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/;
const EMAIL_REGEXP = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ZIP_REGEXP = /^[0-9\-]+$/;
// const NUMBER_REGEXP = /^\s*(\-|\+)?(\d+|(\d*(\.\d*)))\s*$/;


const isValidEmail = (email)=> EMAIL_REGEXP.test(email);

const isValidZip = (zip) => {
    if(_.isEmpty(zip)){
        return false;
    }
    if(_.size(zip) === 5){
        return zip.replace(/\D/g, '').length === 5;
    } else if(_.size(zip) === 10){
        return ZIP_REGEXP.test(zip) && zip.charAt(5) === '-' && zip.replace(/\D/g, '').length === 9;
    } else {
        return false;
    }
};

export { isValidEmail, isValidZip }
