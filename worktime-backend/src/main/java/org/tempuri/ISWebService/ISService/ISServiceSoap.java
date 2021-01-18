/**
 * ISServiceSoap.java
 *
 * This file was auto-generated from WSDL
 * by the Apache Axis 1.4 Apr 22, 2006 (06:55:48 PDT) WSDL2Java emitter.
 */

package org.tempuri.ISWebService.ISService;

public interface ISServiceSoap extends java.rmi.Remote {
    public boolean checkUserAuthentication(java.lang.String userID, java.lang.String password) throws java.rmi.RemoteException;

    /**
     * format String Date='yyyy-MM-dd' ปีเป็น ค.ศ. เช่น 2009-01-01
     */
    public org.tempuri.ISWebService.ISService.Holiday[] getHoliday(java.lang.String userID, java.lang.String startDate, java.lang.String endDate) throws java.rmi.RemoteException;

    /**
     * format String Date='yyyy-MM-dd' ปีเป็น ค.ศ. เช่น 2009-01-01
     */
    public org.tempuri.ISWebService.ISService.LeaveInformation[] getLeave(java.lang.String userID, java.lang.String startDate, java.lang.String endDate) throws java.rmi.RemoteException;

    /**
     * SexType::A=All,M=Male,F=Female
     */
    public org.tempuri.ISWebService.ISService.LeaveType[] getLeaveType() throws java.rmi.RemoteException;
    public org.tempuri.ISWebService.ISService.LeaveSection[] getLeaveSection() throws java.rmi.RemoteException;
    public java.lang.String customerService(java.lang.String compCde, java.lang.String customerCde, java.lang.String customerName, java.lang.String addBy, java.lang.String updBy, java.lang.String customerNo, java.lang.String customerThaiName, java.lang.String location, java.lang.String billAddress, java.lang.String customerRemark, java.lang.String naccGroup, java.lang.String taxID, java.lang.String branchNo, java.lang.String officeFlag, java.lang.String otherTaxID, java.lang.String registerVAT) throws java.rmi.RemoteException;
    public java.lang.String getCustomerService(java.lang.String compCde, java.lang.String customerNo) throws java.rmi.RemoteException;
    public java.lang.String getCustomerCdeService(java.lang.String compCde, java.lang.String customerCde) throws java.rmi.RemoteException;
    public java.lang.String preContractService(java.lang.String compCde, java.lang.String contYear, java.lang.String customerNo, java.lang.String updBy, java.lang.String preContractName, java.lang.String contDesc, java.lang.String preContractRemark, java.lang.String custPersonName, java.lang.String custPersonEmail, java.lang.String custPersonTel, java.lang.String custPersonPosition, java.lang.String preContractStatusCode, java.lang.String prodGrpCde, java.lang.String preContType, java.lang.String preContSaleAmount, java.lang.String startDate, java.lang.String endDate) throws java.rmi.RemoteException;
    public java.lang.String updatePreContractService(java.lang.String compCde, java.lang.String contYear, java.lang.String contSeq, java.lang.String preContractCode, java.lang.String preContractName, java.lang.String contDesc, java.lang.String customerNo, java.lang.String custPersonName, java.lang.String custPersonEmail, java.lang.String custPersonTel, java.lang.String custPersonPosition, java.lang.String preContractStatusCode, java.lang.String contNo, java.lang.String preContractRemark, java.lang.String updBy, java.lang.String prodGrpCde, java.lang.String preContType, java.lang.String preContSaleAmount, java.lang.String startDate, java.lang.String endDate) throws java.rmi.RemoteException;
    public java.lang.String getPreContractService(java.lang.String compCde, java.lang.String contYear, java.lang.String contSeq) throws java.rmi.RemoteException;
    public java.lang.String EContractService(java.lang.String compCde, java.lang.String contType, java.lang.String contKind, java.lang.String payerNo, java.lang.String payerCde, java.lang.String payerPersonName, java.lang.String customerNo, java.lang.String customerCde, java.lang.String custPersonName, java.lang.String signDate, java.lang.String endContDte, java.lang.String empno, java.lang.String saleID, java.lang.String preContractCode, java.lang.String projDesc) throws java.rmi.RemoteException;
    public java.lang.String getWarrantyPeriodESRI(java.lang.String contType, java.lang.String contYearStart, java.lang.String contYearEnd, java.lang.String endUserCde, java.lang.String payerCde, java.lang.String salesID, java.lang.String WAEndYearStart, java.lang.String WAEndYearEnd) throws java.rmi.RemoteException;
}
