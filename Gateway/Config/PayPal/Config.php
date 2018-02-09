<?php
/**
 * Copyright © 2013-2017 Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Magento\Braintree\Gateway\Config\PayPal;

use Magento\Framework\App\Config\ScopeConfigInterface;
use Magento\Payment\Model\CcConfig;

/**
 * Class Config
 */
class Config extends \Magento\Payment\Gateway\Config\Config
{
    const KEY_ACTIVE = 'active';

    const KEY_TITLE = 'title';

    const KEY_DISPLAY_ON_SHOPPING_CART = 'display_on_shopping_cart';

    const KEY_ALLOW_TO_EDIT_SHIPPING_ADDRESS = 'allow_shipping_address_override';

    const KEY_MERCHANT_NAME_OVERRIDE = 'merchant_name_override';

    const KEY_REQUIRE_BILLING_ADDRESS = 'require_billing_address';

    const KEY_PAYEE_EMAIL = 'payee_email';

    const KEY_BUTTON_SHAPE = 'button_shape';

    const KEY_BUTTON_COLOR = 'button_color';

    /**
     * @var CcConfig
     */
    private $ccConfig;

    /**
     * @var array
     */
    private $icon = [];

    /**
     * Config constructor.
     * @param ScopeConfigInterface $scopeConfig
     * @param CcConfig $ccConfig
     * @param null $methodCode
     * @param string $pathPattern
     */
    public function __construct(
        ScopeConfigInterface $scopeConfig,
        CcConfig $ccConfig,
        $methodCode = null,
        $pathPattern = self::DEFAULT_PATH_PATTERN
    ) {
        parent::__construct($scopeConfig, $methodCode, $pathPattern);
        $this->ccConfig = $ccConfig;
    }

    /**
     * Get Payment configuration status
     *
     * @return bool
     */
    public function isActive()
    {
        return (bool) $this->getValue(self::KEY_ACTIVE);
    }

    /**
     * @return bool
     */
    public function isDisplayShoppingCart()
    {
        return (bool) $this->getValue(self::KEY_DISPLAY_ON_SHOPPING_CART);
    }

    /**
     * Is shipping address can be editable on PayPal side
     *
     * @return bool
     */
    public function isAllowToEditShippingAddress()
    {
        return (bool) $this->getValue(self::KEY_ALLOW_TO_EDIT_SHIPPING_ADDRESS);
    }

    /**
     * Get merchant name to display in PayPal popup
     *
     * @return string
     */
    public function getMerchantName()
    {
        return $this->getValue(self::KEY_MERCHANT_NAME_OVERRIDE);
    }

    /**
     * Is billing address can be required
     *
     * @return string
     */
    public function isRequiredBillingAddress()
    {
        return $this->getValue(self::KEY_REQUIRE_BILLING_ADDRESS);
    }

    /**
     * Get title of payment
     *
     * @return string
     */
    public function getTitle()
    {
        return $this->getValue(self::KEY_TITLE);
    }

    /**
     * Get payee email
     *
     * @return string
     */
    public function getPayeeEmail()
    {
        return $this->getValue(self::KEY_PAYEE_EMAIL);
    }

    /**
     * Get button shape mapped to the value expected by the PayPal API
     *
     * @return string
     */
    public function getButtonShape()
    {
        $value = $this->getValue(self::KEY_BUTTON_SHAPE);
        $map = [
            0 => 'pill',
            1 => 'rect'
        ];

        if (isset($map[$value])) {
            return $map[$value];
        }

        return $map[0];
    }

    /**
     * Get button color mapped to the value expected by the PayPal API
     *
     * @return string
     */
    public function getButtonColor()
    {
        $value = $this->getValue(self::KEY_BUTTON_COLOR);
        $map = [
            0 => 'blue',
            1 => 'black',
            2 => 'gold',
            3 => 'silver'
        ];

        if (isset($map[$value])) {
            return $map[$value];
        }

        return $map[0];
    }

    /**
     * Get PayPal icon
     * @return array
     */
    public function getPayPalIcon()
    {
        if (empty($this->icon)) {
            $asset = $this->ccConfig->createAsset('Magento_Braintree::images/paypal.png');
            list($width, $height) = getimagesize($asset->getSourceFile());
            $this->icon = [
                'url' => $asset->getUrl(),
                'width' => $width,
                'height' => $height
            ];
        }

        return $this->icon;
    }
}
