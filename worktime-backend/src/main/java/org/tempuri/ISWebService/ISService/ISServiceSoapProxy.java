package org.tempuri.ISWebService.ISService;

public class ISServiceSoapProxy implements org.tempuri.ISWebService.ISService.ISServiceSoap {
  private String _endpoint = null;
  private org.tempuri.ISWebService.ISService.ISServiceSoap iSServiceSoap = null;
  
  public ISServiceSoapProxy() {
    _initISServiceSoapProxy();
  }
  
  public ISServiceSoapProxy(String endpoint) {
    _endpoint = endpoint;
    _initISServiceSoapProxy();
  }
  
  private void _initISServiceSoapProxy() {
    try {
      iSServiceSoap = (new org.tempuri.ISWebService.ISService.ISServiceLocator()).getISServiceSoap();
      if (iSServiceSoap != null) {
        if (_endpoint != null)
          ((javax.xml.rpc.Stub)iSServiceSoap)._setProperty("javax.xml.rpc.service.endpoint.address", _endpoint);
        else
          _endpoint = (String)((javax.xml.rpc.Stub)iSServiceSoap)._getProperty("javax.xml.rpc.service.endpoint.address");
      }
      
    }
    catch (javax.xml.rpc.ServiceException serviceException) {}
  }
  
  public String getEndpoint() {
    return _endpoint;
  }
  
  public void setEndpoint(String endpoint) {
    _endpoint = endpoint;
    if (iSServiceSoap != null)
      ((javax.xml.rpc.Stub)iSServiceSoap)._setProperty("javax.xml.rpc.service.endpoint.address", _endpoint);
    
  }
  
  public org.tempuri.ISWebService.ISService.ISServiceSoap getISServiceSoap() {
    if (iSServiceSoap == null)
      _initISServiceSoapProxy();
    return iSServiceSoap;
  }
  
  public boolean checkUserAuthentication(java.lang.String userID, java.lang.String password) throws java.rmi.RemoteException{
    if (iSServiceSoap == null)
      _initISServiceSoapProxy();
    return iSServiceSoap.checkUserAuthentication(userID, password);
  }
  
  public org.tempuri.ISWebService.ISService.Holiday[] getHoliday(java.lang.String userID, java.lang.String startDate, java.lang.String endDate) throws java.rmi.RemoteException{
    if (iSServiceSoap == null)
      _initISServiceSoapProxy();
    return iSServiceSoap.getHoliday(userID, startDate, endDate);
  }
  
  public org.tempuri.ISWebService.ISService.LeaveInformation[] getLeave(java.lang.String userID, java.lang.String startDate, java.lang.String endDate) throws java.rmi.RemoteException{
    if (iSServiceSoap == null)
      _initISServiceSoapProxy();
    return iSServiceSoap.getLeave(userID, startDate, endDate);
  }
  
  public org.tempuri.ISWebService.ISService.LeaveType[] getLeaveType() throws java.rmi.RemoteException{
    if (iSServiceSoap == null)
      _initISServiceSoapProxy();
    return iSServiceSoap.getLeaveType();
  }
  
  public org.tempuri.ISWebService.ISService.LeaveSection[] getLeaveSection() throws java.rmi.RemoteException{
    if (iSServiceSoap == null)
      _initISServiceSoapProxy();
    return iSServiceSoap.getLeaveSection();
  }
  
  public java.lang.String customerService(java.lang.String compCde, java.lang.String customerCde, java.lang.String customerName, java.lang.String addBy, java.lang.String updBy, java.lang.String customerNo, java.lang.String customerThaiName, java.lang.String location, java.lang.String billAddress, java.lang.String customerRemark, java.lang.String naccGroup, java.lang.String taxID, java.lang.String branchNo, java.lang.String officeFlag, java.lang.String otherTaxID, java.lang.String registerVAT) throws java.rmi.RemoteException{
    if (iSServiceSoap == null)
      _initISServiceSoapProxy();
    return iSServiceSoap.customerService(compCde, customerCde, customerName, addBy, updBy, customerNo, customerThaiName, location, billAddress, customerRemark, naccGroup, taxID, branchNo, officeFlag, otherTaxID, registerVAT);
  }
  
  public java.lang.String getCustomerService(java.lang.String compCde, java.lang.String customerNo) throws java.rmi.RemoteException{
    if (iSServiceSoap == null)
      _initISServiceSoapProxy();
    return iSServiceSoap.getCustomerService(compCde, customerNo);
  }
  
  public java.lang.String getCustomerCdeService(java.lang.String compCde, java.lang.String customerCde) throws java.rmi.RemoteException{
    if (iSServiceSoap == null)
      _initISServiceSoapProxy();
    return iSServiceSoap.getCustomerCdeService(compCde, customerCde);
  }
  
  public java.lang.String preContractService(java.lang.String compCde, java.lang.String contYear, java.lang.String customerNo, java.lang.String updBy, java.lang.String preContractName, java.lang.String contDesc, java.lang.String preContractRemark, java.lang.String custPersonName, java.lang.String custPersonEmail, java.lang.String custPersonTel, java.lang.String custPersonPosition, java.lang.String preContractStatusCode, java.lang.String prodGrpCde, java.lang.String preContType, java.lang.String preContSaleAmount, java.lang.String startDate, java.lang.String endDate) throws java.rmi.RemoteException{
    if (iSServiceSoap == null)
      _initISServiceSoapProxy();
    return iSServiceSoap.preContractService(compCde, contYear, customerNo, updBy, preContractName, contDesc, preContractRemark, custPersonName, custPersonEmail, custPersonTel, custPersonPosition, preContractStatusCode, prodGrpCde, preContType, preContSaleAmount, startDate, endDate);
  }
  
  public java.lang.String updatePreContractService(java.lang.String compCde, java.lang.String contYear, java.lang.String contSeq, java.lang.String preContractCode, java.lang.String preContractName, java.lang.String contDesc, java.lang.String customerNo, java.lang.String custPersonName, java.lang.String custPersonEmail, java.lang.String custPersonTel, java.lang.String custPersonPosition, java.lang.String preContractStatusCode, java.lang.String contNo, java.lang.String preContractRemark, java.lang.String updBy, java.lang.String prodGrpCde, java.lang.String preContType, java.lang.String preContSaleAmount, java.lang.String startDate, java.lang.String endDate) throws java.rmi.RemoteException{
    if (iSServiceSoap == null)
      _initISServiceSoapProxy();
    return iSServiceSoap.updatePreContractService(compCde, contYear, contSeq, preContractCode, preContractName, contDesc, customerNo, custPersonName, custPersonEmail, custPersonTel, custPersonPosition, preContractStatusCode, contNo, preContractRemark, updBy, prodGrpCde, preContType, preContSaleAmount, startDate, endDate);
  }
  
  public java.lang.String getPreContractService(java.lang.String compCde, java.lang.String contYear, java.lang.String contSeq) throws java.rmi.RemoteException{
    if (iSServiceSoap == null)
      _initISServiceSoapProxy();
    return iSServiceSoap.getPreContractService(compCde, contYear, contSeq);
  }
  
  public java.lang.String EContractService(java.lang.String compCde, java.lang.String contType, java.lang.String contKind, java.lang.String payerNo, java.lang.String payerCde, java.lang.String payerPersonName, java.lang.String customerNo, java.lang.String customerCde, java.lang.String custPersonName, java.lang.String signDate, java.lang.String endContDte, java.lang.String empno, java.lang.String saleID, java.lang.String preContractCode, java.lang.String projDesc) throws java.rmi.RemoteException{
    if (iSServiceSoap == null)
      _initISServiceSoapProxy();
    return iSServiceSoap.EContractService(compCde, contType, contKind, payerNo, payerCde, payerPersonName, customerNo, customerCde, custPersonName, signDate, endContDte, empno, saleID, preContractCode, projDesc);
  }
  
  public java.lang.String getWarrantyPeriodESRI(java.lang.String contType, java.lang.String contYearStart, java.lang.String contYearEnd, java.lang.String endUserCde, java.lang.String payerCde, java.lang.String salesID, java.lang.String WAEndYearStart, java.lang.String WAEndYearEnd) throws java.rmi.RemoteException{
    if (iSServiceSoap == null)
      _initISServiceSoapProxy();
    return iSServiceSoap.getWarrantyPeriodESRI(contType, contYearStart, contYearEnd, endUserCde, payerCde, salesID, WAEndYearStart, WAEndYearEnd);
  }
  
  
}