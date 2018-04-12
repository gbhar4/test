export const endpoints = {
  updateOrderItem: {
    method: 'PUT',
    URI: 'updateOrderItem'
  },
  deleteAllItemsInCart: {
    method: 'DELETE',
    URI: 'deleteAllItemsInCart'
  },
  addOrderItem: {
    method: 'POST',
    URI: 'addOrderItem'
  },
  addOrderBopisItem: {
    method: 'POST',
    URI: 'tcporder/createBopisOrder'
  },
  updateOrderBopisItem: {
    method: 'PUT',
    URI: 'updateOrderItem'
  },
  moveWishListItem: {
    method: 'PUT',
    URI: 'tcpproduct/moveItemToWishList'
  },
  updateMultiSelectItemsToRemove: {
    method: 'PUT',
    URI: 'updateMultiSelectItemsToRemove'
  },
  createWishList: {
    method: 'POST',
    URI: 'createWishList'
  },
  addWishListItem: {
    method: 'PUT',
    URI: 'addWishListItem'
  },
  updateWishListItem: {
    method: 'PUT',
    URI: 'updateWishListItem'
  },
  updateDeleteItem: {
    method: 'PUT',
    URI: 'updateDeleteItem'
  },
  getOrderDetails: {
    method: 'GET',
    URI: 'getOrderDetails'
  },
  getCoupon: {
    method: 'GET',
    URI: 'payment/getCoupon'
  },
  getCartInfo: {
    method: 'GET',
    URI: 'getCartInfo'
  },
  getOrderSummary: {
    method: 'GET',
    URI: 'getOrderSummary'
  },
  addCoupons: {
    method: 'POST',
    URI: 'payment/coupons'
  },
  removeCouponOrPromo: {
    method: 'POST',
    URI: 'payment/removePromotionCode'
  },
  getSwatchesAndSizeInfo: {
    method: 'GET',
    URI: 'getSwatchesAndSizeInfo'
  },
  getUserWishlists: {
    method: 'GET',
    URI: 'getWishList'
  },
  getSKUDetails: {
    method: 'GET',
    URI: 'getSKUDetails'
  },
  setDefaultShippingAddress: {
    method: 'PUT',
    URI: 'payment/setDefaultShippingAddress'
  },
  addSignUpEmail: {
    method: 'POST',
    URI: 'addSignUpEmail'
  },
  addCustomerRegistration: {
    method: 'POST',
    URI: 'addCustomerRegistration'
  },
  logon: {
    method: 'POST',
    URI: 'logon'
  },
  addCheckout: {
    method: 'POST',
    URI: 'addCheckout'
  },
  deletePaymentInstruction: {
    method: 'POST',
    URI: 'payment/deletePaymentInstruction'
  },
  getShipmentMethods: {
    method: 'GET',
    URI: 'payment/getShipmentMethods'
  },
  updatePaymentInstruction: {
    method: 'PUT',
    URI: 'payment/updatePaymentInstruction'
  },
  updateShippingMethodSelection: {
    method: 'PUT',
    URI: 'payment/updateShippingMethodSelection'
  },
  addGiftOptions: {
    method: 'POST',
    URI: 'payment/addGiftOptions'
  },
  getOrderReview: {
    method: 'GET',
    URI: 'getOrderReview'
  },
  getOrderConfirmation: {
    method: 'GET',
    URI: 'getOrderConfirmation'
  },
  getPaymentInfo: {
    method: 'GET',
    URI: 'payment/getPaymentInfo'
  },
  updateCheckout: {
    method: 'PUT',
    URI: 'updateCheckout'
  },
  addPaymentInstruction: {
    method: 'POST',
    URI: 'payment/addPaymentInstruction'
  },
  getUserPaymentInformation: {
    method: 'GET',
    URI: 'payment/getPaymentInfo'
  },
  getCountryHandler: {
    method: 'GET',
    URI: 'getCountryHandler'
  },
  getAddressFromBook: {
    method: 'GET',
    URI: 'payment/getAddressFromBook'
  },
  giftOptionsCmd: {
    method: 'GET',
    URI: 'payment/giftOptionsCmd'
  },
  getAssignedPromotioncodeInfo: {
    method: 'GET',
    URI: 'payment/getAssignedPromotioncodeInfo'
  },
  addAddress: {
    method: 'POST',
    URI: 'payment/addAddress'
  },
  updateAddress: {
    method: 'PUT',
    URI: 'payment/updateAddress'
  },
  getAddressVerification: {
    method: 'GET',
    URI: 'payment/getAddressVerification'
  },
  paypalLookUp: {
    method: 'GET',
    URI: 'payment/TCPPayPalCCLookUpRESTCmd'
  },
  paypalAuth: {
    method: 'GET',
    URI: 'payment/TCPPayPalCCAuthenticationRESTCmd'
  },
  getGifCardBalance: {
    method: 'POST',
    URI: 'payment/getGiftCardBalance'
  },
  updateUserShippingAddress: {
    method: 'PUT',
    URI: 'payment/updateAddress'
  },
  checkout: {
    method: 'POST',
    URI: 'addCheckout'
  },
  preCheckout: {
    method: 'PUT',
    URI: 'updateCheckout'
  },
  getESpot: {
    method: 'GET',
    URI: 'getESpot'
  },
  addShipToStore: {
    method: 'POST',
    URI: 'addShipToStore'
  },
  getAutoSuggestions: {
    method: 'GET',
    URI: 'tcpproduct/searchTermSuggestions'
  },
  getHeaderService: {
    method: 'GET',
    URI: 'tcpproduct/getTopCategories'
  },
  getMyPointHistory: {
    method: 'GET',
    URI: 'payment/getMyPointHistory'
  },
  requestPassword: {
    method: 'PUT',
    URI: 'resetpassword'
  },
  getCountryList: {
    method: 'GET',
    URI: 'getCountryListAndHeaderInfo'
  },
  logout: {
    method: 'DELETE',
    URI: 'logout'
  },
  getPointsService: {
    method: 'GET',
    URI: 'payment/getPointsService'
  },
  getRegisteredUserDetailsInfo: {
    method: 'GET',
    URI: 'payment/getRegisteredUserDetailsInfo'
  },
  deleteAddressDetails: {
    method: 'DELETE',
    URI: 'payment/deleteAddressDetails'
  },
  deleteCreditCardDetails: {
    method: 'POST',
    URI: 'payment/deleteCreditCardDetails'
  },
  addCreditCardDetails: {
    method: 'POST',
    URI: 'payment/addCreditCardDetails'
  },
  getCreditCardDetails: {
    method: 'GET',
    URI: 'payment/getCreditCardDetails'
  },
  modifyCreditCardDetails: {
    method: 'POST',
    URI: 'payment/modifyCreditCardDetails'
  },
  updatesAccountDataForRegisteredUser: {
    method: 'PUT',
    URI: 'payment/updatesAccountDataForRegisteredUser'
  },
  getSitePromotions: {
    method: 'GET',
    URI: 'payment/getAvailableOffers'
  },
  orderLookUp: {
    method: 'GET',
    URI: 'tcporder/orderLookUp'
  },
  updateAirMilesInfo: {
    method: 'POST',
    URI: 'tcporder/updateAirMilesInfo'
  },
  getOrderHistory: {
    method: 'GET',
    URI: 'tcporder/getOrderHistory'
  },
  addOrUpdateWishlist: {
    method: 'PUT',
    URI: 'addOrUpdateWishlist'
  },
  updateShippingInfo: {
    method: 'PUT',
    URI: 'tcporder/updateShippingInfo'
  },
  startExpressCheckout: {
    method: 'POST',
    URI: 'tcporder/expressCheckout'
  },
  setShipToHome: {
    method: 'PUT',
    URI: 'updateOrderItem'
  },
  reservationLookUp: {
    legacy: true,
    method: 'GET',
    URI: '/webapp/wcs/stores/servlet/TCPReservationLookup'
  },
  getAllAvailableCouponsAndPromos: {
    method: 'GET',
    URI: 'tcporder/getAllCoupons'
  },
  applicationKillSwitches: {
    method: 'GET',
    URI: 'tcporder/getXAppConfigValues'
  },
  getUnqualifiedItems: {
    method: 'GET',
    URI: 'tcporder/getUnqualifiedItems'
  },
  getFavoriteStore: {
    method: 'GET',
    URI: 'tcporder/getFavouriteStoreLocation'
  },
  getPointsHistory: {
    method: 'GET',
    URI: 'payment/getMyPointHistory'
  },
  claimPoints: {
    method: 'POST',
    URI: 'tcpdataservice/assignTransaction'
  },
  addGiftCardToAccount: {
    method: 'POST',
    URI: 'payment/addCreditCardDetails'
  },
  deleteGiftCardOnAccount: {
    method: 'POST',
    URI: 'payment/deleteCreditCardDetails'
  },
  deleteCreditCardOnAccount: {
    method: 'POST',
    URI: 'payment/deleteCreditCardDetails'
  },
  setFavoriteStore: {
    method: 'POST',
    URI: 'tcporder/addFavouriteStoreLocation'
  },
  updateFavoriteStore: {
    method: 'PUT',
    URI: 'tcporder/updateFavouriteStoreLocation'
  },
  deleteFavoriteStore: {
    method: 'DELETE',
    URI: 'tcporder/deleteFavouriteStoreLocation'
  },
  updateProfileInfo: {
    method: 'PUT',
    URI: 'payment/updatesAccountDataForRegisteredUser'
  },
  getStoreInfoByLocationId: {
    method: 'GET',
    URI: 'tcporder/getStoreInfo'
  },
  getDetailedOrderHistory: {
    method: 'GET',
    URI: 'tcporder/getPointsAndOrderHistory'
  },
  addChild: {
    method: 'POST',
    URI: 'tcporder/addBirthdaySavings'
  },
  deleteAddressOnAccount: {
    method: 'DELETE',
    URI: 'payment/deleteAddressDetails'
  },
  getReservationHistory: {
    method: 'GET',
    URI: 'payment/getReservationHistory'
  },
  updateChild: {
    method: 'POST',
    URI: 'tcporder/updateBirthdaySavings'
  },
  deleteChild: {
    method: 'POST',
    URI: 'tcporder/deleteBirthdaySavings'
  },
  getChildren: {
    method: 'GET',
    URI: 'tcporder/getBirthdaySavings'
  },
  acceptOrDeclineWIC: {
    method: 'POST',
    URI: 'tcpdataservice/madeoffer'
  },
  instantCreditApplication: {
    method: 'POST',
    URI: 'tcpstore/processWIC'
  },
  prescreenApplication: {
    method: 'POST',
    URI: 'tcpstore/processPreScreenAcceptance'
  },
  authToken: {
    method: 'GET',
    URI: 'oauth/access-token'
  },
  newReservationLookUp: {
    method: 'GET',
    URI: 'tcpstore/tcpReservationLookup'
  },
  processPreScreenCodeValidation: {
    method: 'POST',
    URI: 'tcpstore/processPreScreenCodeValidation'
  },
  processPreScreenOffer: {
    method: 'POST',
    URI: 'tcpstore/processMadeOffer'
  },
  findStoresbyLatitudeandLongitude: {
    method: 'GET',
    URI: 'tcpproduct/findStoresbyLatitudeandLongitude'
  },
  getStoreLocationByCountry: {
    method: 'GET',
    URI: 'tcpproduct/getStoreLocationByCountry'
  },
  shareWishListForUser: {
    method: 'POST',
    URI: 'tcpproduct/shareWishListForUser'
  },
  deleteWishListForUser: {
    method: 'DELETE',
    URI: 'tcpproduct/deleteWishListForUser'
  },
  deleteWishListItemForUser: {
    method: 'DELETE',
    URI: 'tcpproduct/deleteItemFromWishList'
  },
  createWishListForUser: {
    method: 'POST',
    URI: 'tcpproduct/createWishListForUser'
  },
  getListofWishList: {
    method: 'GET',
    URI: 'tcpstore/getListofWishList'
  },
  sortingWishList: {
    method: 'GET',
    URI: 'tcpstore/sortingWishList'
  },
  getWishListbyId: {
    method: 'GET',
    URI: 'tcpproduct/getWishListbyId'
  },
  sendEmailForContactUs: {
    method: 'POST',
    URI: 'tcpproduct/sendEmailForContactUs'
  },
  getProductInfoById: {
    method: 'GET',
    URI: 'tcpproduct/getBundleByProductId'
  },
  editWishList: {
    method: 'PUT',
    URI: 'tcpproduct/updateWishListForUser'
  },
  makeWishListasDefault: {
    method: 'GET',
    URI: 'tcpstore/makeWishListasDefault'
  },
  updateDescriptionofWishList: {
    method: 'GET',
    URI: 'tcpproduct/updateDescriptionofWishList'
  },
  getUserBopisStores: {
    method: 'GET',
    URI: 'tcporder/getUserBopisStores'
  },
  getStoreandProductInventoryInfo: {
    method: 'GET',
    URI: 'tcpstore/getStoreandProductInventoryInfo'
  },
  addProductToCart: {
    method: 'POST',
    URI: 'tcpproduct/addProductToCart'
  },
  getSKUInventoryandProductCounterDetails: {
    method: 'GET',
    URI: 'tcpproduct/getSKUInventoryandProductCounterDetails'
  },
  getBundleIdAndBundleDetails: {
    method: 'GET',
    URI: 'tcpproduct/getBundleIdAndBundleDetails'
  },
  getProductsByOutfits: {
    method: 'GET',
    URI: 'tcpproduct/getProductsByOutfits'
  },
  getProductviewbyCategory: {
    method: 'GET',
    URI: 'tcpproduct/getProductviewbyCategory'
  },
  getProductsBySearchTerm: {
    method: 'GET',
    URI: 'tcpproduct/getProductsBySearchTerm'
  },
  getProductByPartNumber: {
    method: 'GET',
    URI: 'tcpproduct/getProductByPartNumber'
  },
  getListofDefaultWishlist: {
    method: 'POST',
    URI: 'tcpstore/getListofDefaultWishlist'
  },
  getPriceDetails: {
    method: 'GET',
    URI: 'tcpproduct/getPriceDetails'
  },
  getInventoryForOutfits: {
    method: 'POST',
    URI: 'tcpproduct/getInventoryForOutfits'
  },
  internationalCheckoutSettings: {
    method: 'POST',
    URI: 'tcporder/internationalCheckout'
  }
};
