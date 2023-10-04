import React from "react";

export function Whitepaper(pdfURL) {
  return (
    <div><iframe src={pdfURL} style={{width:'100%',height:'100%'}}></iframe></div>
    
  );
}
