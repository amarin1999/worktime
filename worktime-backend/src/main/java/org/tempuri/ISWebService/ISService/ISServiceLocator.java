/**
 * ISServiceLocator.java
 *
 * This file was auto-generated from WSDL
 * by the Apache Axis 1.4 Apr 22, 2006 (06:55:48 PDT) WSDL2Java emitter.
 */

package org.tempuri.ISWebService.ISService;

public class ISServiceLocator extends org.apache.axis.client.Service implements org.tempuri.ISWebService.ISService.ISService {

    public ISServiceLocator() {
    }


    public ISServiceLocator(org.apache.axis.EngineConfiguration config) {
        super(config);
    }

    public ISServiceLocator(java.lang.String wsdlLoc, javax.xml.namespace.QName sName) throws javax.xml.rpc.ServiceException {
        super(wsdlLoc, sName);
    }

    // Use to get a proxy class for ISServiceSoap
    private java.lang.String ISServiceSoap_address = "http://cdgisweb.cdg.co.th/iswebservice/isservice.asmx";

    public java.lang.String getISServiceSoapAddress() {
        return ISServiceSoap_address;
    }

    // The WSDD service name defaults to the port name.
    private java.lang.String ISServiceSoapWSDDServiceName = "ISServiceSoap";

    public java.lang.String getISServiceSoapWSDDServiceName() {
        return ISServiceSoapWSDDServiceName;
    }

    public void setISServiceSoapWSDDServiceName(java.lang.String name) {
        ISServiceSoapWSDDServiceName = name;
    }

    public org.tempuri.ISWebService.ISService.ISServiceSoap getISServiceSoap() throws javax.xml.rpc.ServiceException {
       java.net.URL endpoint;
        try {
            endpoint = new java.net.URL(ISServiceSoap_address);
        }
        catch (java.net.MalformedURLException e) {
            throw new javax.xml.rpc.ServiceException(e);
        }
        return getISServiceSoap(endpoint);
    }

    public org.tempuri.ISWebService.ISService.ISServiceSoap getISServiceSoap(java.net.URL portAddress) throws javax.xml.rpc.ServiceException {
        try {
            org.tempuri.ISWebService.ISService.ISServiceSoapStub _stub = new org.tempuri.ISWebService.ISService.ISServiceSoapStub(portAddress, this);
            _stub.setPortName(getISServiceSoapWSDDServiceName());
            return _stub;
        }
        catch (org.apache.axis.AxisFault e) {
            return null;
        }
    }

    public void setISServiceSoapEndpointAddress(java.lang.String address) {
        ISServiceSoap_address = address;
    }

    /**
     * For the given interface, get the stub implementation.
     * If this service has no port for the given interface,
     * then ServiceException is thrown.
     */
    public java.rmi.Remote getPort(Class serviceEndpointInterface) throws javax.xml.rpc.ServiceException {
        try {
            if (org.tempuri.ISWebService.ISService.ISServiceSoap.class.isAssignableFrom(serviceEndpointInterface)) {
                org.tempuri.ISWebService.ISService.ISServiceSoapStub _stub = new org.tempuri.ISWebService.ISService.ISServiceSoapStub(new java.net.URL(ISServiceSoap_address), this);
                _stub.setPortName(getISServiceSoapWSDDServiceName());
                return _stub;
            }
        }
        catch (java.lang.Throwable t) {
            throw new javax.xml.rpc.ServiceException(t);
        }
        throw new javax.xml.rpc.ServiceException("There is no stub implementation for the interface:  " + (serviceEndpointInterface == null ? "null" : serviceEndpointInterface.getName()));
    }

    /**
     * For the given interface, get the stub implementation.
     * If this service has no port for the given interface,
     * then ServiceException is thrown.
     */
    public java.rmi.Remote getPort(javax.xml.namespace.QName portName, Class serviceEndpointInterface) throws javax.xml.rpc.ServiceException {
        if (portName == null) {
            return getPort(serviceEndpointInterface);
        }
        java.lang.String inputPortName = portName.getLocalPart();
        if ("ISServiceSoap".equals(inputPortName)) {
            return getISServiceSoap();
        }
        else  {
            java.rmi.Remote _stub = getPort(serviceEndpointInterface);
            ((org.apache.axis.client.Stub) _stub).setPortName(portName);
            return _stub;
        }
    }

    public javax.xml.namespace.QName getServiceName() {
        return new javax.xml.namespace.QName("http://tempuri.org/ISWebService/ISService", "ISService");
    }

    private java.util.HashSet ports = null;

    public java.util.Iterator getPorts() {
        if (ports == null) {
            ports = new java.util.HashSet();
            ports.add(new javax.xml.namespace.QName("http://tempuri.org/ISWebService/ISService", "ISServiceSoap"));
        }
        return ports.iterator();
    }

    /**
    * Set the endpoint address for the specified port name.
    */
    public void setEndpointAddress(java.lang.String portName, java.lang.String address) throws javax.xml.rpc.ServiceException {
        
if ("ISServiceSoap".equals(portName)) {
            setISServiceSoapEndpointAddress(address);
        }
        else 
{ // Unknown Port Name
            throw new javax.xml.rpc.ServiceException(" Cannot set Endpoint Address for Unknown Port" + portName);
        }
    }

    /**
    * Set the endpoint address for the specified port name.
    */
    public void setEndpointAddress(javax.xml.namespace.QName portName, java.lang.String address) throws javax.xml.rpc.ServiceException {
        setEndpointAddress(portName.getLocalPart(), address);
    }

}
