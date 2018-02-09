/**
 * Braintre Apple Pay button api
 * @author Aidan Threadgold <aidan@gene.co.uk>
 */
define(['uiComponent', 'mage/translate', 'mage/storage', 'jquery'], function (Component, $t, storage, jQuery) {
    'use strict';

    return Component.extend({
        defaults: {
            clientToken: null,
            quoteId: 0,
            displayName: null,
            actionSuccess: null,
            grandTotalAmount: 0,
            isLoggedIn: false,
            storeCode: "default"
        },

        /**
         * Set & get api token
         */
        setClientToken: function (value) {
            this.clientToken = value;
        },
        getClientToken: function () {
            return this.clientToken;
        },

        /**
         * Set and get quote id
         */
        setQuoteId: function (value) {
            this.quoteId = value;
        },
        getQuoteId: function () {
            return this.quoteId;
        },

        /**
         * Set and get display name
         */
        setDisplayName: function (value) {
            this.displayName = value;
        },
        getDisplayName: function () {
            return this.displayName;
        },

        /**
         * Set and get success redirection url
         */
        setActionSuccess: function (value) {
            this.actionSuccess = value;
        },
        getActionSuccess: function () {
            return this.actionSuccess;
        },

        /**
         * Set and get grand total
         */
        setGrandTotalAmount: function (value) {
            this.grandTotalAmount = parseFloat(value).toFixed(2);
        },
        getGrandTotalAmount: function () {
            return parseFloat(this.grandTotalAmount);
        },

        /**
         * Set and get is logged in
         */
        setIsLoggedIn: function (value) {
            this.isLoggedIn = value;
        },
        getIsLoggedIn: function (value) {
            return this.isLoggedIn;
        },

        /**
         * Set and get store code
         */
        setStoreCode: function (value) {
            this.storeCode = value;
        },
        getStoreCode: function (value) {
            return this.storeCode;
        },

        /**
         * API Urls for logged in / guest
         */
        getApiUrl: function (uri) {
            if (this.getIsLoggedIn() === true) {
                return "rest/" + this.getStoreCode() + "/V1/carts/mine/" + uri;
            } else {
                return "rest/" + this.getStoreCode() + "/V1/guest-carts/" + this.getQuoteId() + "/" + uri;
            }
        },

        /**
         * Payment request info
         */
        getPaymentRequest: function () {
            return {
                total: {
                    label: this.getDisplayName(),
                    amount: this.getGrandTotalAmount()
                },
                requiredShippingContactFields: ['postalAddress', 'name', 'email', 'phone'],
                requiredBillingContactFields: ['postalAddress', 'name']
            };
        },

        /**
         * Retrieve shipping methods based on address
         */
        onShippingContactSelect: function (event, session) {
            var address = event.shippingContact,
                newItems = [],
                payload = {
                    address: {
                        city: address.locality,
                        region: address.administrativeArea,
                        country_id: address.countryCode,
                        postcode: address.postalCode,
                        save_in_address_book :0
                    }
                };

            // Retrieve shipping methods
            storage.post(
                this.getApiUrl("estimate-shipping-methods"),
                JSON.stringify(payload)
            ).done(function (r) {
                var shippingMethods = [],
                    method = {};
                this.shippingMethods = {};

                // Stop if no shipping methods
                if (r.length == 0) {
                    session.abort();
                    alert($t("There are no shiping methods available for you right now - please try an again or use an alternative payment method."));
                    return false;
                }

                // Format shipping methods array
                for (var i = 0; i < r.length; i++) {
                    method = {
                        identifier: r[i].method_code,
                        label: r[i].method_title,
                        detail: r[i].carrier_title ? r[i].carrier_title : "",
                        amount: parseFloat(r[i].amount).toFixed(2)
                    };
                    shippingMethods.push(method);
                    this.shippingMethods[ r[i].method_code ] = r[i];
                }

                // Set the shipping method to the first option
                this.shippingMethod = r[0].method_code;

                // Pass shipping methods back
                session.completeShippingContactSelection(
                    ApplePaySession.STATUS_SUCCESS,
                    shippingMethods,
                    {
                        label: this.getDisplayName(),
                        amount: parseFloat(this.getGrandTotalAmount() + parseFloat(shippingMethods[0].amount)).toFixed(2)
                    },
                    [{
                        type: 'final',
                        label: $t('Shipping'),
                        amount: shippingMethods[0].amount
                    }]
                );
            }.bind(this)).fail(function (r) {
                session.abort();
                console.error("Braintree ApplePay Unable to find shipping methods for estimate-shipping-methods", r);
                alert($t("We were unable to find any shipping methods for you. Please try an alternative payment method."));
            });
        },

        /**
         * Record which shipping method has been selected & Updated totals
         */
        onShippingMethodSelect: function (event, session) {
            var shippingMethod = event.shippingMethod;
            this.shippingMethod = shippingMethod.identifier;

            session.completeShippingMethodSelection(
                ApplePaySession.STATUS_SUCCESS,
                {
                    label: this.getDisplayName(),
                    amount: this.getGrandTotalAmount() + parseFloat(shippingMethod.amount)
                },
                [{
                    type: 'final',
                    label: $t('Shipping'),
                    amount: shippingMethod.amount
                }]
            );
        },

        /**
         * Place the order
         */
        startPlaceOrder: function (nonce, event, session) {
            var shippingContact = event.payment.shippingContact,
                billingContact = event.payment.billingContact,
                payload = {
                    "addressInformation": {
                        "shipping_address": {
                            "email": shippingContact.emailAddress,
                            "telephone": shippingContact.phoneNumber,
                            "firstname": shippingContact.givenName,
                            "lastname": shippingContact.familyName,
                            "street": shippingContact.addressLines,
                            "city": shippingContact.locality,
                            "region": shippingContact.administrativeArea,
                            "region_id": null,
                            "region_code": null,
                            "country_id": shippingContact.countryCode,
                            "postcode": shippingContact.postalCode,
                            "same_as_billing": 0,
                            "customer_address_id": 0,
                            "save_in_address_book": 0
                        },
                        "billing_address": {
                            "email": shippingContact.emailAddress,
                            "telephone": '0000000000',
                            "firstname": billingContact.givenName,
                            "lastname": billingContact.familyName,
                            "street": billingContact.addressLines,
                            "city": billingContact.locality,
                            "region": billingContact.administrativeArea,
                            "region_id": null,
                            "region_code": null,
                            "country_id": billingContact.countryCode,
                            "postcode": billingContact.postalCode,
                            "same_as_billing": 0,
                            "customer_address_id": 0,
                            "save_in_address_book": 0
                        },
                        "shipping_method_code": this.shippingMethods[ this.shippingMethod ].method_code,
                        "shipping_carrier_code": this.shippingMethods[ this.shippingMethod ].carrier_code
                    }
                };

            // Set addresses
            storage.post(
                this.getApiUrl("shipping-information"),
                JSON.stringify(payload)
            ).done(function () {

                // Submit payment information
                storage
                    .post(
                        this.getApiUrl("payment-information"),
                        JSON.stringify(
                            {
                                "email": shippingContact.emailAddress,
                                "paymentMethod": {
                                    "method": "braintree_applepay",
                                    "additional_data": {
                                        "payment_method_nonce": nonce
                                    }
                                }
                            }
                    ))
                    .done(function (r) {
                        document.location = this.getActionSuccess();
                        session.completePayment(ApplePaySession.STATUS_SUCCESS);
                    }.bind(this))
                    .fail(function (r) {
                        session.completePayment(ApplePaySession.STATUS_FAILURE);
                        session.abort();
                        alert($t("We were unable to take your payment over Apple Pay - please try an again or use an alternative payment method."));
                        console.error("Braintree ApplePay Unable to take payment", r);
                        return false;
                    });

            }.bind(this)).fail(function (r) {
                console.error("Braintree ApplePay Unable to set shipping information", r);
                session.completePayment(ApplePaySession.STATUS_INVALID_BILLING_POSTAL_ADDRESS);
            });
        }
    });
});