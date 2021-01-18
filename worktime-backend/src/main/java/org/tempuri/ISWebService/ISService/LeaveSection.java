/**
 * LeaveSection.java
 *
 * This file was auto-generated from WSDL
 * by the Apache Axis 1.4 Apr 22, 2006 (06:55:48 PDT) WSDL2Java emitter.
 */

package org.tempuri.ISWebService.ISService;

public class LeaveSection  implements java.io.Serializable {
    private java.lang.String sectionCode;

    private java.lang.String sectionName;

    private java.lang.String sectionNameEng;

    private java.lang.String sectionNameDisplay;

    private java.math.BigDecimal sectionValue;

    public LeaveSection() {
    }

    public LeaveSection(
           java.lang.String sectionCode,
           java.lang.String sectionName,
           java.lang.String sectionNameEng,
           java.lang.String sectionNameDisplay,
           java.math.BigDecimal sectionValue) {
           this.sectionCode = sectionCode;
           this.sectionName = sectionName;
           this.sectionNameEng = sectionNameEng;
           this.sectionNameDisplay = sectionNameDisplay;
           this.sectionValue = sectionValue;
    }


    /**
     * Gets the sectionCode value for this LeaveSection.
     * 
     * @return sectionCode
     */
    public java.lang.String getSectionCode() {
        return sectionCode;
    }


    /**
     * Sets the sectionCode value for this LeaveSection.
     * 
     * @param sectionCode
     */
    public void setSectionCode(java.lang.String sectionCode) {
        this.sectionCode = sectionCode;
    }


    /**
     * Gets the sectionName value for this LeaveSection.
     * 
     * @return sectionName
     */
    public java.lang.String getSectionName() {
        return sectionName;
    }


    /**
     * Sets the sectionName value for this LeaveSection.
     * 
     * @param sectionName
     */
    public void setSectionName(java.lang.String sectionName) {
        this.sectionName = sectionName;
    }


    /**
     * Gets the sectionNameEng value for this LeaveSection.
     * 
     * @return sectionNameEng
     */
    public java.lang.String getSectionNameEng() {
        return sectionNameEng;
    }


    /**
     * Sets the sectionNameEng value for this LeaveSection.
     * 
     * @param sectionNameEng
     */
    public void setSectionNameEng(java.lang.String sectionNameEng) {
        this.sectionNameEng = sectionNameEng;
    }


    /**
     * Gets the sectionNameDisplay value for this LeaveSection.
     * 
     * @return sectionNameDisplay
     */
    public java.lang.String getSectionNameDisplay() {
        return sectionNameDisplay;
    }


    /**
     * Sets the sectionNameDisplay value for this LeaveSection.
     * 
     * @param sectionNameDisplay
     */
    public void setSectionNameDisplay(java.lang.String sectionNameDisplay) {
        this.sectionNameDisplay = sectionNameDisplay;
    }


    /**
     * Gets the sectionValue value for this LeaveSection.
     * 
     * @return sectionValue
     */
    public java.math.BigDecimal getSectionValue() {
        return sectionValue;
    }


    /**
     * Sets the sectionValue value for this LeaveSection.
     * 
     * @param sectionValue
     */
    public void setSectionValue(java.math.BigDecimal sectionValue) {
        this.sectionValue = sectionValue;
    }

    private java.lang.Object __equalsCalc = null;
    public synchronized boolean equals(java.lang.Object obj) {
        if (!(obj instanceof LeaveSection)) return false;
        LeaveSection other = (LeaveSection) obj;
        if (obj == null) return false;
        if (this == obj) return true;
        if (__equalsCalc != null) {
            return (__equalsCalc == obj);
        }
        __equalsCalc = obj;
        boolean _equals;
        _equals = true && 
            ((this.sectionCode==null && other.getSectionCode()==null) || 
             (this.sectionCode!=null &&
              this.sectionCode.equals(other.getSectionCode()))) &&
            ((this.sectionName==null && other.getSectionName()==null) || 
             (this.sectionName!=null &&
              this.sectionName.equals(other.getSectionName()))) &&
            ((this.sectionNameEng==null && other.getSectionNameEng()==null) || 
             (this.sectionNameEng!=null &&
              this.sectionNameEng.equals(other.getSectionNameEng()))) &&
            ((this.sectionNameDisplay==null && other.getSectionNameDisplay()==null) || 
             (this.sectionNameDisplay!=null &&
              this.sectionNameDisplay.equals(other.getSectionNameDisplay()))) &&
            ((this.sectionValue==null && other.getSectionValue()==null) || 
             (this.sectionValue!=null &&
              this.sectionValue.equals(other.getSectionValue())));
        __equalsCalc = null;
        return _equals;
    }

    private boolean __hashCodeCalc = false;
    public synchronized int hashCode() {
        if (__hashCodeCalc) {
            return 0;
        }
        __hashCodeCalc = true;
        int _hashCode = 1;
        if (getSectionCode() != null) {
            _hashCode += getSectionCode().hashCode();
        }
        if (getSectionName() != null) {
            _hashCode += getSectionName().hashCode();
        }
        if (getSectionNameEng() != null) {
            _hashCode += getSectionNameEng().hashCode();
        }
        if (getSectionNameDisplay() != null) {
            _hashCode += getSectionNameDisplay().hashCode();
        }
        if (getSectionValue() != null) {
            _hashCode += getSectionValue().hashCode();
        }
        __hashCodeCalc = false;
        return _hashCode;
    }

    // Type metadata
    private static org.apache.axis.description.TypeDesc typeDesc =
        new org.apache.axis.description.TypeDesc(LeaveSection.class, true);

    static {
        typeDesc.setXmlType(new javax.xml.namespace.QName("http://tempuri.org/ISWebService/ISService", "LeaveSection"));
        org.apache.axis.description.ElementDesc elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("sectionCode");
        elemField.setXmlName(new javax.xml.namespace.QName("http://tempuri.org/ISWebService/ISService", "SectionCode"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "string"));
        elemField.setMinOccurs(0);
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("sectionName");
        elemField.setXmlName(new javax.xml.namespace.QName("http://tempuri.org/ISWebService/ISService", "SectionName"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "string"));
        elemField.setMinOccurs(0);
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("sectionNameEng");
        elemField.setXmlName(new javax.xml.namespace.QName("http://tempuri.org/ISWebService/ISService", "SectionNameEng"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "string"));
        elemField.setMinOccurs(0);
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("sectionNameDisplay");
        elemField.setXmlName(new javax.xml.namespace.QName("http://tempuri.org/ISWebService/ISService", "SectionNameDisplay"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "string"));
        elemField.setMinOccurs(0);
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("sectionValue");
        elemField.setXmlName(new javax.xml.namespace.QName("http://tempuri.org/ISWebService/ISService", "SectionValue"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "decimal"));
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
    }

    /**
     * Return type metadata object
     */
    public static org.apache.axis.description.TypeDesc getTypeDesc() {
        return typeDesc;
    }

    /**
     * Get Custom Serializer
     */
    public static org.apache.axis.encoding.Serializer getSerializer(
           java.lang.String mechType, 
           java.lang.Class _javaType,  
           javax.xml.namespace.QName _xmlType) {
        return 
          new  org.apache.axis.encoding.ser.BeanSerializer(
            _javaType, _xmlType, typeDesc);
    }

    /**
     * Get Custom Deserializer
     */
    public static org.apache.axis.encoding.Deserializer getDeserializer(
           java.lang.String mechType, 
           java.lang.Class _javaType,  
           javax.xml.namespace.QName _xmlType) {
        return 
          new  org.apache.axis.encoding.ser.BeanDeserializer(
            _javaType, _xmlType, typeDesc);
    }

}
