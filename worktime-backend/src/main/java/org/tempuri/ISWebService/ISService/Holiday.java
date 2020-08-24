/**
 * Holiday.java
 *
 * This file was auto-generated from WSDL
 * by the Apache Axis 1.4 Apr 22, 2006 (06:55:48 PDT) WSDL2Java emitter.
 */

package org.tempuri.ISWebService.ISService;

public class Holiday  implements java.io.Serializable {
    private java.lang.String holidayEngName;

    private java.lang.String holidayThaiName;

    private java.lang.String holidayDate;

    private java.lang.String holidayStatus;

    private java.lang.String substituteFor;

    private java.lang.String updateBy;

    private java.lang.String updateDate;

    public Holiday() {
    }

    public Holiday(
           java.lang.String holidayEngName,
           java.lang.String holidayThaiName,
           java.lang.String holidayDate,
           java.lang.String holidayStatus,
           java.lang.String substituteFor,
           java.lang.String updateBy,
           java.lang.String updateDate) {
           this.holidayEngName = holidayEngName;
           this.holidayThaiName = holidayThaiName;
           this.holidayDate = holidayDate;
           this.holidayStatus = holidayStatus;
           this.substituteFor = substituteFor;
           this.updateBy = updateBy;
           this.updateDate = updateDate;
    }


    /**
     * Gets the holidayEngName value for this Holiday.
     * 
     * @return holidayEngName
     */
    public java.lang.String getHolidayEngName() {
        return holidayEngName;
    }


    /**
     * Sets the holidayEngName value for this Holiday.
     * 
     * @param holidayEngName
     */
    public void setHolidayEngName(java.lang.String holidayEngName) {
        this.holidayEngName = holidayEngName;
    }


    /**
     * Gets the holidayThaiName value for this Holiday.
     * 
     * @return holidayThaiName
     */
    public java.lang.String getHolidayThaiName() {
        return holidayThaiName;
    }


    /**
     * Sets the holidayThaiName value for this Holiday.
     * 
     * @param holidayThaiName
     */
    public void setHolidayThaiName(java.lang.String holidayThaiName) {
        this.holidayThaiName = holidayThaiName;
    }


    /**
     * Gets the holidayDate value for this Holiday.
     * 
     * @return holidayDate
     */
    public java.lang.String getHolidayDate() {
        return holidayDate;
    }


    /**
     * Sets the holidayDate value for this Holiday.
     * 
     * @param holidayDate
     */
    public void setHolidayDate(java.lang.String holidayDate) {
        this.holidayDate = holidayDate;
    }


    /**
     * Gets the holidayStatus value for this Holiday.
     * 
     * @return holidayStatus
     */
    public java.lang.String getHolidayStatus() {
        return holidayStatus;
    }


    /**
     * Sets the holidayStatus value for this Holiday.
     * 
     * @param holidayStatus
     */
    public void setHolidayStatus(java.lang.String holidayStatus) {
        this.holidayStatus = holidayStatus;
    }


    /**
     * Gets the substituteFor value for this Holiday.
     * 
     * @return substituteFor
     */
    public java.lang.String getSubstituteFor() {
        return substituteFor;
    }


    /**
     * Sets the substituteFor value for this Holiday.
     * 
     * @param substituteFor
     */
    public void setSubstituteFor(java.lang.String substituteFor) {
        this.substituteFor = substituteFor;
    }


    /**
     * Gets the updateBy value for this Holiday.
     * 
     * @return updateBy
     */
    public java.lang.String getUpdateBy() {
        return updateBy;
    }


    /**
     * Sets the updateBy value for this Holiday.
     * 
     * @param updateBy
     */
    public void setUpdateBy(java.lang.String updateBy) {
        this.updateBy = updateBy;
    }


    /**
     * Gets the updateDate value for this Holiday.
     * 
     * @return updateDate
     */
    public java.lang.String getUpdateDate() {
        return updateDate;
    }


    /**
     * Sets the updateDate value for this Holiday.
     * 
     * @param updateDate
     */
    public void setUpdateDate(java.lang.String updateDate) {
        this.updateDate = updateDate;
    }

    private java.lang.Object __equalsCalc = null;
    public synchronized boolean equals(java.lang.Object obj) {
        if (!(obj instanceof Holiday)) return false;
        Holiday other = (Holiday) obj;
        if (obj == null) return false;
        if (this == obj) return true;
        if (__equalsCalc != null) {
            return (__equalsCalc == obj);
        }
        __equalsCalc = obj;
        boolean _equals;
        _equals = true && 
            ((this.holidayEngName==null && other.getHolidayEngName()==null) || 
             (this.holidayEngName!=null &&
              this.holidayEngName.equals(other.getHolidayEngName()))) &&
            ((this.holidayThaiName==null && other.getHolidayThaiName()==null) || 
             (this.holidayThaiName!=null &&
              this.holidayThaiName.equals(other.getHolidayThaiName()))) &&
            ((this.holidayDate==null && other.getHolidayDate()==null) || 
             (this.holidayDate!=null &&
              this.holidayDate.equals(other.getHolidayDate()))) &&
            ((this.holidayStatus==null && other.getHolidayStatus()==null) || 
             (this.holidayStatus!=null &&
              this.holidayStatus.equals(other.getHolidayStatus()))) &&
            ((this.substituteFor==null && other.getSubstituteFor()==null) || 
             (this.substituteFor!=null &&
              this.substituteFor.equals(other.getSubstituteFor()))) &&
            ((this.updateBy==null && other.getUpdateBy()==null) || 
             (this.updateBy!=null &&
              this.updateBy.equals(other.getUpdateBy()))) &&
            ((this.updateDate==null && other.getUpdateDate()==null) || 
             (this.updateDate!=null &&
              this.updateDate.equals(other.getUpdateDate())));
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
        if (getHolidayEngName() != null) {
            _hashCode += getHolidayEngName().hashCode();
        }
        if (getHolidayThaiName() != null) {
            _hashCode += getHolidayThaiName().hashCode();
        }
        if (getHolidayDate() != null) {
            _hashCode += getHolidayDate().hashCode();
        }
        if (getHolidayStatus() != null) {
            _hashCode += getHolidayStatus().hashCode();
        }
        if (getSubstituteFor() != null) {
            _hashCode += getSubstituteFor().hashCode();
        }
        if (getUpdateBy() != null) {
            _hashCode += getUpdateBy().hashCode();
        }
        if (getUpdateDate() != null) {
            _hashCode += getUpdateDate().hashCode();
        }
        __hashCodeCalc = false;
        return _hashCode;
    }

    // Type metadata
    private static org.apache.axis.description.TypeDesc typeDesc =
        new org.apache.axis.description.TypeDesc(Holiday.class, true);

    static {
        typeDesc.setXmlType(new javax.xml.namespace.QName("http://tempuri.org/ISWebService/ISService", "Holiday"));
        org.apache.axis.description.ElementDesc elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("holidayEngName");
        elemField.setXmlName(new javax.xml.namespace.QName("http://tempuri.org/ISWebService/ISService", "HolidayEngName"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "string"));
        elemField.setMinOccurs(0);
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("holidayThaiName");
        elemField.setXmlName(new javax.xml.namespace.QName("http://tempuri.org/ISWebService/ISService", "HolidayThaiName"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "string"));
        elemField.setMinOccurs(0);
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("holidayDate");
        elemField.setXmlName(new javax.xml.namespace.QName("http://tempuri.org/ISWebService/ISService", "HolidayDate"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "string"));
        elemField.setMinOccurs(0);
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("holidayStatus");
        elemField.setXmlName(new javax.xml.namespace.QName("http://tempuri.org/ISWebService/ISService", "HolidayStatus"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "string"));
        elemField.setMinOccurs(0);
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("substituteFor");
        elemField.setXmlName(new javax.xml.namespace.QName("http://tempuri.org/ISWebService/ISService", "SubstituteFor"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "string"));
        elemField.setMinOccurs(0);
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("updateBy");
        elemField.setXmlName(new javax.xml.namespace.QName("http://tempuri.org/ISWebService/ISService", "UpdateBy"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "string"));
        elemField.setMinOccurs(0);
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("updateDate");
        elemField.setXmlName(new javax.xml.namespace.QName("http://tempuri.org/ISWebService/ISService", "UpdateDate"));
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
