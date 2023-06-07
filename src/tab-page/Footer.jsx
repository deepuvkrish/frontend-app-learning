import React from 'react'
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';


const Footer = ({ }) => {

    const footerClass={
        display:"flex",
        justifyContent:"center",
        color:"#667085",
        fontFamily:"Manrope",
        fontWeight:"5   00",
        fontSize:"14px",
        paddingBottom:"10px",
    };
    return(
        <div style={footerClass}>
            <span className='footerInfo'>Copyright &#169; 2023 SkillAssure All rights reserved </span>
        </div>
    );
};

export default injectIntl(Footer);