/**
 * ISService.java
 *
 * This file was auto-generated from WSDL
 * by the Apache Axis 1.4 Apr 22, 2006 (06:55:48 PDT) WSDL2Java emitter.
 */

package org.tempuri.ISWebService.ISService;

public interface ISService extends javax.xml.rpc.Service {
    public java.lang.String getISServiceSoapAddress();

    public org.tempuri.ISWebService.ISService.ISServiceSoap getISServiceSoap() throws javax.xml.rpc.ServiceException;

    public org.tempuri.ISWebService.ISService.ISServiceSoap getISServiceSoap(java.net.URL portAddress) throws javax.xml.rpc.ServiceException;
}
