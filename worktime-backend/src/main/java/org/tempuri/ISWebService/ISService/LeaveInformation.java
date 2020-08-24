/**
 * LeaveInformation.java
 *
 * This file was auto-generated from WSDL
 * by the Apache Axis 1.4 Apr 22, 2006 (06:55:48 PDT) WSDL2Java emitter.
 */

package org.tempuri.ISWebService.ISService;

public class LeaveInformation  implements java.io.Serializable {
    private java.lang.String dayNote;

    private java.lang.String empNo;

    private java.lang.String leaveDate;

    private java.lang.String leaveAlias;

    private java.lang.String leaveInformation;

    private java.lang.String leaveSection;

    private java.lang.String leaveType;

    private java.lang.String sectionCode;

    public LeaveInformation() {
    }

    public LeaveInformation(
           java.lang.String dayNote,
           java.lang.String empNo,
           java.lang.String leaveDate,
           java.lang.String leaveAlias,
           java.lang.String leaveInformation,
           java.lang.String leaveSection,
           java.lang.String leaveType,
           java.lang.String sectionCode) {
           this.dayNote = dayNote;
           this.empNo = empNo;
           this.leaveDate = leaveDate;
           this.leaveAlias = leaveAlias;
           this.leaveInformation = leaveInformation;
           this.leaveSection = leaveSection;
           this.leaveType = leaveType;
           this.sectionCode = sectionCode;
    }


    /**
     * Gets the dayNote value for this LeaveInformation.
     * 
     * @return dayNote
     */
    public java.lang.String getDayNote() {
        return dayNote;
    }


    /**
     * Sets the dayNote value for this LeaveInformation.
     * 
     * @param dayNote
     */
    public void setDayNote(java.lang.String dayNote) {
        this.dayNote = dayNote;
    }


    /**
     * Gets the empNo value for this LeaveInformation.
     * 
     * @return empNo
     */
    public java.lang.String getEmpNo() {
        return empNo;
    }


    /**
     * Sets the empNo value for this LeaveInformation.
     * 
     * @param empNo
     */
    public void setEmpNo(java.lang.String empNo) {
        this.empNo = empNo;
    }


    /**
     * Gets the leaveDate value for this LeaveInformation.
     * 
     * @return leaveDate
     */
    public java.lang.String getLeaveDate() {
        return leaveDate;
    }


    /**
     * Sets the leaveDate value for this LeaveInformation.
     * 
     * @param leaveDate
     */
    public void setLeaveDate(java.lang.String leaveDate) {
        this.leaveDate = leaveDate;
    }


    /**
     * Gets the leaveAlias value for this LeaveInformation.
     * 
     * @return leaveAlias
     */
    public java.lang.String getLeaveAlias() {
        return leaveAlias;
    }


    /**
     * Sets the leaveAlias value for this LeaveInformation.
     * 
     * @param leaveAlias
     */
    public void setLeaveAlias(java.lang.String leaveAlias) {
        this.leaveAlias = leaveAlias;
    }


    /**
     * Gets the leaveInformation value for this LeaveInformation.
     * 
     * @return leaveInformation
     */
    public java.lang.String getLeaveInformation() {
        return leaveInformation;
    }


    /**
     * Sets the leaveInformation value for this LeaveInformation.
     * 
     * @param leaveInformation
     */
    public void setLeaveInformation(java.lang.String leaveInformation) {
        this.leaveInformation = leaveInformation;
    }


    /**
     * Gets the leaveSection value for this LeaveInformation.
     * 
     * @return leaveSection
     */
    public java.lang.String getLeaveSection() {
        return leaveSection;
    }


    /**
     * Sets the leaveSection value for this LeaveInformation.
     * 
     * @param leaveSection
     */
    public void setLeaveSection(java.lang.String leaveSection) {
        this.leaveSection = leaveSection;
    }


    /**
     * Gets the leaveType value for this LeaveInformation.
     * 
     * @return leaveType
     */
    public java.lang.String getLeaveType() {
        return leaveType;
    }


    /**
     * Sets the leaveType value for this LeaveInformation.
     * 
     * @param leaveType
     */
    public void setLeaveType(java.lang.String leaveType) {
        this.leaveType = leaveType;
    }


    /**
     * Gets the sectionCode value for this LeaveInformation.
     * 
     * @return sectionCode
     */
    public java.lang.String getSectionCode() {
        return sectionCode;
    }


    /**
     * Sets the sectionCode value for this LeaveInformation.
     * 
     * @param sectionCode
     */
    public void setSectionCode(java.lang.String sectionCode) {
        this.sectionCode = sectionCode;
    }

    private java.lang.Object __equalsCalc = null;
    public synchronized boolean equals(java.lang.Object obj) {
        if (!(obj instanceof LeaveInformation)) return false;
        LeaveInformation other = (LeaveInformation) obj;
        if (obj == null) return false;
        if (this == obj) return true;
        if (__equalsCalc != null) {
            return (__equalsCalc == obj);
        }
        __equalsCalc = obj;
        boolean _equals;
        _equals = true && 
            ((this.dayNote==null && other.getDayNote()==null) || 
             (this.dayNote!=null &&
              this.dayNote.equals(other.getDayNote()))) &&
            ((this.empNo==null && other.getEmpNo()==null) || 
             (this.empNo!=null &&
              this.empNo.equals(other.getEmpNo()))) &&
            ((this.leaveDate==null && other.getLeaveDate()==null) || 
             (this.leaveDate!=null &&
              this.leaveDate.equals(other.getLeaveDate()))) &&
            ((this.leaveAlias==null && other.getLeaveAlias()==null) || 
             (this.leaveAlias!=null &&
              this.leaveAlias.equals(other.getLeaveAlias()))) &&
            ((this.leaveInformation==null && other.getLeaveInformation()==null) || 
             (this.leaveInformation!=null &&
              this.leaveInformation.equals(other.getLeaveInformation()))) &&
            ((this.leaveSection==null && other.getLeaveSection()==null) || 
             (this.leaveSection!=null &&
              this.leaveSection.equals(other.getLeaveSection()))) &&
            ((this.leaveType==null && other.getLeaveType()==null) || 
             (this.leaveType!=null &&
              this.leaveType.equals(other.getLeaveType()))) &&
            ((this.sectionCode==null && other.getSectionCode()==null) || 
             (this.sectionCode!=null &&
              this.sectionCode.equals(other.getSectionCode())));
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
        if (getDayNote() != null) {
            _hashCode += getDayNote().hashCode();
        }
        if (getEmpNo() != null) {
            _hashCode += getEmpNo().hashCode();
        }
        if (getLeaveDate() != null) {
            _hashCode += getLeaveDate().hashCode();
        }
        if (getLeaveAlias() != null) {
            _hashCode += getLeaveAlias().hashCode();
        }
        if (getLeaveInformation() != null) {
            _hashCode += getLeaveInformation().hashCode();
        }
        if (getLeaveSection() != null) {
            _hashCode += getLeaveSection().hashCode();
        }
        if (getLeaveType() != null) {
            _hashCode += getLeaveType().hashCode();
        }
        if (getSectionCode() != null) {
            _hashCode += getSectionCode().hashCode();
        }
        __hashCodeCalc = false;
        return _hashCode;
    }

    // Type metadata
    private static org.apache.axis.description.TypeDesc typeDesc =
        new org.apache.axis.description.TypeDesc(LeaveInformation.class, true);

    static {
        typeDesc.setXmlType(new javax.xml.namespace.QName("http://tempuri.org/ISWebService/ISService", "LeaveInformation"));
        org.apache.axis.description.ElementDesc elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("dayNote");
        elemField.setXmlName(new javax.xml.namespace.QName("http://tempuri.org/ISWebService/ISService", "DayNote"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "string"));
        elemField.setMinOccurs(0);
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("empNo");
        elemField.setXmlName(new javax.xml.namespace.QName("http://tempuri.org/ISWebService/ISService", "EmpNo"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "string"));
        elemField.setMinOccurs(0);
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("leaveDate");
        elemField.setXmlName(new javax.xml.namespace.QName("http://tempuri.org/ISWebService/ISService", "LeaveDate"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "string"));
        elemField.setMinOccurs(0);
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("leaveAlias");
        elemField.setXmlName(new javax.xml.namespace.QName("http://tempuri.org/ISWebService/ISService", "LeaveAlias"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "string"));
        elemField.setMinOccurs(0);
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("leaveInformation");
        elemField.setXmlName(new javax.xml.namespace.QName("http://tempuri.org/ISWebService/ISService", "LeaveInformation"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "string"));
        elemField.setMinOccurs(0);
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("leaveSection");
        elemField.setXmlName(new javax.xml.namespace.QName("http://tempuri.org/ISWebService/ISService", "LeaveSection"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "string"));
        elemField.setMinOccurs(0);
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("leaveType");
        elemField.setXmlName(new javax.xml.namespace.QName("http://tempuri.org/ISWebService/ISService", "LeaveType"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "string"));
        elemField.setMinOccurs(0);
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("sectionCode");
        elemField.setXmlName(new javax.xml.namespace.QName("http://tempuri.org/ISWebService/ISService", "SectionCode"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "string"));
        elemField.setMinOccurs(0);
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
