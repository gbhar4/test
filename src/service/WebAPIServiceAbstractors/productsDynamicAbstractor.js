/**
@module productsDynamicAbstractor
*/
import {endpoints} from './endpoints.js';
import {ServiceResponseError} from 'service/ServiceResponseError';
import {bindAllClassMethodsToThis} from 'util/bindAllClassMethodsToThis';
import {parseBoolean} from '../apiUtil';
import {PRODUCTS_PER_LOAD} from 'reduxStore/storeViews/productListingStoreView.js';
import axios from 'axios';
import superagent from 'superagent';

const STYLITICS_OUTFIT_TAGS = {
  'Girl': 'girls_gallery',
  'Toddler Girl': 'toddler_girls_gallery',
  'Boy': 'boys_gallery',
  'Toddler Boy': 'toddler_boys_gallery'
};

let previous = null;
export function getProductsAbstractor (apiHelper) {
  if (!previous || previous.apiHelper !== apiHelper) {
    previous = new ProductsDynamicAbstractor(apiHelper);
  }
  return previous;
}

class ProductsDynamicAbstractor {
  constructor (apiHelper) {
    this.apiHelper = apiHelper;

    // create this-bound varsions of all methods of this class
    bindAllClassMethodsToThis(this);
  }

  /**
   * @function getInventoryAndFavoritsCount
   * @summary This API will return invetory count for all sizes/fits of a requested color as well as the amount of users who favorited that color
   * @param {String} colorProductId - This is the Id of the product you want to get, you can get this from the order summary API
   * @example getInventoryAndFavoritsCount("863272").then((res) => {
      {
        favoritesCounter: 3
        inventory: [
          {
            skuId: "866748"
            inventory: "715"
          },
          {
            skuId: "867958"
            inventory: "1010"
          },
          {
            skuId: "868343"
            inventory: "0"
          }
        ]
      }
  })
   */
  getInventoryAndFavoritsCount (colorProductId) {
    let payload = {
      header: {
        productId: colorProductId
      },
      webService: endpoints.getSKUInventoryandProductCounterDetails
    };

    return this.apiHelper.webServiceCall(payload).then((res) => {
      if (this.apiHelper.responseContainsErrors(res)) {
        throw new ServiceResponseError(res);
      }
      let favoritesCounter = res.body.getProductCounter;
      let inventory = res.body.getAllSKUInventoryByProductId;

      return {
        inventory: inventory && inventory[0] && inventory[0].response.map((item) => ({
          skuId: item.catentryId,
          inventory: parseInt(item.quantity)
        })),
        favoritesCounter: parseInt(favoritesCounter && favoritesCounter[0] && favoritesCounter[0].counter) || 0
      };
    }).catch((err) => {
      throw this.apiHelper.getFormattedError(err);
    });
  }

  /**
   * @function getProductInfoById
   * @summary This will get product info and all color/sizes for that product
   */
  getProductInfoById (colorIdOrSeoKeyword, getImgPath) {
    let payload = {
      header: {
        // catalogId: 10001,
        productCatentryId: colorIdOrSeoKeyword
        // bundleType: 'Outfits'
      },
      webService: endpoints.getBundleIdAndBundleDetails
    };

    return this.apiHelper.webServiceCall(payload).then((res) => {
      if (this.apiHelper.responseContainsErrors(res)) {
        throw new ServiceResponseError(res);
      }

      let product = res.body.catalogEntryView && res.body.catalogEntryView[0];
      return this.parseProductFromAPI(product, colorIdOrSeoKeyword, false, getImgPath);
    }).catch((err) => {
      throw this.apiHelper.getFormattedError(err);
    });
  }

  /**
   * @function filterOutNoneWishlistItems
   * @summary This will return item level info with respect to the current user, like if an item is in the users favorits
   */
  getProductsUserCustomInfo (generalProductIdsList) {
    let payload = {
      body: {
        productId: generalProductIdsList // ([279518, 888020, 767760, 51596])
      },
      webService: endpoints.getListofDefaultWishlist
    };

    return this.apiHelper.webServiceCall(payload).then((res) => {
      if (this.apiHelper.responseContainsErrors(res)) {
        throw new ServiceResponseError(res);
      }

      let favProductsMap = {};
      for (let product of res.body) {
        favProductsMap[product.productId] = {
          isInDefaultWishlist: product.isInDefaultWishlist
        };
      }

      return favProductsMap;
    }).catch((err) => {
      throw this.apiHelper.getFormattedError(err);
    });
  }

  /**
   * @function getSwatchesAndSizes
   * @summary This API will return a map of all colors and their fits/sizes. You give it a colorId and it will get all other colors that the product has
   * @param {String} colorProductId - This is the Id of the product you want to get, you can get this from the order summary API.
   * @return {Array<Object>} This will resolve with an Array of objects each object is a size of a given skuId. each object is a size that hold the quanitty available
   * @example getSwatchesAndSizes("863272").then((res) => {
     console.log(res);
     [
      {
        colorProductId: 863272,
        color: {
          name: 'blue',
          imagePath: 'img url'
        },

        maxAvailable: Number.MAX_VALUE,
        hasFits: false,
        fits: [{
          fitName: undefined  or 'regular' or 'husky',
          maxAvailable: Number.MAX_VALUE,
          sizes: [
                    {
                      maxAvailable: Number.MAX_VALUE
                      skuId:"749224"
                      sizeName:"9-12 M"
                    },
                    {
                      maxAvailable: Number.MAX_VALUE
                      skuId:"749224"
                      sizeName:"12-18 M"
                    }
             ]
          }]
      }
      ]
  })
   */
  getSwatchesAndSizes (colorProductId, swatchImgGenerator) {
    let payload = {
      header: {
        productId: colorProductId
      },
      webService: endpoints.getSwatchesAndSizeInfo
    };

    return this.apiHelper.webServiceCall(payload).then((res) => {
      if (this.apiHelper.responseContainsErrors(res)) {
        throw new ServiceResponseError(res);
      }

      if (!(Object.values(res.body)[0].PartNumber)) {     // if product is a gift card (these have no PartNumber)
        return getGiftCardColorsAndSizes(this.apiHelper, res.body);
      } else {
        return getRegularItemColorsAndSizes(this.apiHelper, res.body, swatchImgGenerator);
      }
    }).catch((err) => {
      throw this.apiHelper.getFormattedError(err);
    });
  }

  setShipToHome (orderItemId) {
    let payload = {
      body: {
        orderId: '.',
        orderItem: [{
          orderItemId: orderItemId
        }],
        x_storeLocId: '',
        x_calculationUsage: '-1,-3,-5,-6,-7',
        x_isUpdateDescription: 'true',
        x_orderitemtype: 'BOPIS'
      },
      webService: endpoints.setShipToHome
    };

    return this.apiHelper.webServiceCall(payload).then((res) => {
      if (this.apiHelper.responseContainsErrors(res)) {
        throw new ServiceResponseError(res);
      } else {
        return { success: true };
      }
    }).catch((err) => {
      throw this.apiHelper.getFormattedError(err);
    });
  }

  /**
    * @function getProductInfoById
    * @see https://childrensplace.atlassian.net/wiki/display/DT/TCP+API+Specifications?preview=/44072969/69110098/TCP%20-%20API%20Design%20Specification%20-%20Category-Checkout_PDP_getProductById_v1.docx
    * @param {String} generalProductId - The id of the item you want to get the info for
    * @param {String} seoKeyword - SEO parameter BE needs (I don't know why, it makes our code convoluted. id should be enought (that's why it's an id)
   */
    // getProductInfoById (generalProductId, seoKeyword) {
    //   let payload = {
    //     header: {
    //       productId: generalProductId,
    //       productSEOKeyword: seoKeyword // WTF is this needed?
    //     },
    //     webService: endpoints.getProductInfoById
    //   };

    //   return this.apiHelper.webServiceCall(payload).then((res) => {
    //     if (this.apiHelper.responseContainsErrors(res)) {
    //       throw new ServiceResponseError(res);
    //     }

    //     return res.body || []; // FIXME: not much of an abstractor - this would likely not be the raw data from the service
    //   }).catch((err) => {
    //     throw this.apiHelper.getFormattedError(err);
    //   });
    // }

  /**
   * @function addItemToCart
   * @param {String} sku - The sku of the eleent to add to the cart
   * @param {Number} quantity - Requested quantity
   * @param {String} wishlistId - The id of the wishlist to which the product belongs to (if identified)
   */
  addItemToCart (sku, quantity, wishlistId) {
    let payload = {
      header: {
      },
      body: {
        // comment:62132,
        'calculationUsage[]': '-7',
        storeId: this.apiHelper._configOptions.storeId,
        catalogId: this.apiHelper._configOptions.catalogId,
        langId: this.apiHelper._configOptions.langId,
        orderId: '.',
        field2: '0',
        requesttype: 'ajax',
        catEntryId: sku,
        quantity: quantity.toString(),
        externalId: wishlistId
      },
      webService: endpoints.addProductToCart
    };

    return this.apiHelper.webServiceCall(payload).then((res) => {
      if (this.apiHelper.responseContainsErrors(res)) {
        throw new ServiceResponseError(res);
      }

      return {success: true} || [];
    }).catch((err) => {
      throw this.apiHelper.getFormattedError(err);
    });
  }

  /**
   * @function getOutfitProdutsDetails
   * @summary This API is used for outfits. You can pass the URI that will be a list of concated part numbers.
   * vendorColorProductIdsList is a string of dash ('-') separated porduct id's of the outfits vendor
   **/
  getOutfitProdutsDetails (outfitId, vendorColorProductIdsList, getImgPath) {
    let productPartNumbers = vendorColorProductIdsList.split('-');
    let payload = {
      header: {
        partNumber: productPartNumbers.map((maybeId) => maybeId.split('_')[0]).join('-')
      },
      webService: endpoints.getProductsByOutfits
    };

    return this.apiHelper.webServiceCall(payload).then((res) => {
      if (this.apiHelper.responseContainsErrors(res)) {
        throw new ServiceResponseError(res);
      }

      let orderedProducts = res.body.catalogEntryView.sort((prev, next) => prev.requestedOrder - next.requestedOrder);
      let outFitProductsArray = [];
      let outfitProductPromises = orderedProducts.filter((product) => !!product.components).map((product, index) => {
        let colorComponent = product.components.find((component) => productPartNumbers.indexOf(component.partNumber) > -1);

        return this.parseProductFromAPI(product, colorComponent ? colorComponent.uniqueID : (product.components.length ? product.components[0].uniqueID : null), true, getImgPath).then((productAndBreadcrumb) => {
          outFitProductsArray[index] = productAndBreadcrumb.product;
          return product;
        });
      });

      return Promise.all(outfitProductPromises).then(() => {
        return {
          outfitId: outfitId,
          outfitImageUrl: `https://s3.amazonaws.com/ampersand.production/collage_images/outfit_collage_image/${outfitId}/original.png`, // As per our vendor this URL will never change and always contain the images
          products: outFitProductsArray,
          unavailableCount: productPartNumbers.length - outFitProductsArray.length
        };
      });
    }).catch((err) => {
      throw this.apiHelper.getFormattedError(err);
    });
  }

  getProductColorExtraInfo (colorProductId, categoryType) {
    let payload = {
      header: {
        partNumber: colorProductId
      },
      webService: endpoints.getProductByPartNumber
    };

    return this.apiHelper.webServiceCall(payload).then((res) => {
      if (this.apiHelper.responseContainsErrors(res)) {
        throw new ServiceResponseError(res);
      }

      if (!res.body.catalogEntryView || res.body.catalogEntryView.length === 0) {
        return null;
      }

      let product = res.body.catalogEntryView[0];
      let attributesNames = this.getProductAttributes();

      return {
        listPrice: parseFloat((product.price.find((attr) => attr.usage === 'Display') || {value: null}).value) || parseFloat((product.price.find((attr) => attr.usage === 'Offer') || {value: null}).value) || 0,
        offerPrice: parseFloat((product.price.find((attr) => attr.usage === 'Offer') || {value: null}).value) || 0,
        isBopisEligible: parseBoolean(product.ISBOPIS),
        badge1: extractPrioritizedBadge(product, attributesNames, categoryType),
        badge2: extractAttributeValue(product, attributesNames.extendedSize),
        badge3: extractAttributeValue(product, attributesNames.merchant)
      };
    });
  }

  getCategoryListingPage (seoKeywordOrCategoryIdOrSearchTerm, isSearch, filtersAndSort, pageNumber, extaQueryValues, getImgPath) {
    let {colorFilterIdsList = [], sizeFiltersIdsList = [], departmentFiltersIdsList = [], subDepartmentFiltersIdsList = [], sortId = null} = filtersAndSort;
    // BE currently supports only one department or one sub-department filter (but not both)
    let categoryFilter = subDepartmentFiltersIdsList.length
      ? subDepartmentFiltersIdsList.join(',')           // sub-department filter has higher priority than departmernt filter (if it exists)
      : departmentFiltersIdsList.join(',');

    let payload = {
      header: {
        pageNumber: pageNumber,
        searchType: '-1,-1,0', // Hard Coded this means we want products and not outfits
        pageSize: PRODUCTS_PER_LOAD,
        searchSource: 'E', // hardcode value backend needs for some reason
        facet: [].concat(colorFilterIdsList).concat(sizeFiltersIdsList).join(',')
        // facet: 'color:' + colorFilterIdsList.join(',') + '&' + 'size:' + sizeFiltersIdsList.join(',') // FIXME: backend does not support this yet
      },
      body: {
        ...extaQueryValues,
        departments: departmentFiltersIdsList.join(',')
      },
      webService: isSearch ? endpoints.getProductsBySearchTerm : endpoints.getProductviewbyCategory
    };
    if (!isSearch || categoryFilter) payload.header.categoryId = isSearch ? categoryFilter : seoKeywordOrCategoryIdOrSearchTerm;
    if (isSearch) payload.header.searchTerm = seoKeywordOrCategoryIdOrSearchTerm || '*';
    if (sortId) payload.header.orderBy = sortId;

    return this.apiHelper.webServiceCall(payload).then((res) => {
      if (this.apiHelper.responseContainsErrors(res)) {
        throw new ServiceResponseError(res);
      }

      let pendingPromises = [];
      let breadCrumbs = res.body.breadCrumbTrailEntryView;
      // flags if we are oin an L1 plp. Such plp's have no products, and only show espots and recommendations.
      let isDepartment = !isSearch && (!breadCrumbs || breadCrumbs.length <= 1);
      let attributesNames = this.getProductAttributes();

      let colorsFilterMap = res.body.facetView && res.body.facetView.find((attr) => attr.name === 'Color');
      let sizesFilterMap = res.body.facetView && res.body.facetView.find((attr) => attr.name === attributesNames.sizes);
      let categoryType = res.body.listingSearchType; // TBD: backend to return the category type (clearance, new arrival, etc)
      let departmentsFiltersMap = res.body.categoryType;
      // BE, in their infinite wisdom, send L2 categories only when they send us a single L1 option, and they nest it inside it.
      let subDepartmentsFiltersMap = res.body.categoryType && res.body.categoryType.length > 0 && res.body.categoryType[0].entry;
      let parentCategories = (res.body.siblingCategories && res.body.siblingCategories.childCategoriesList);
      let metaData = res.body.metaData;

      let response = {
        currentListingSearchForText: isSearch ? (res.body.searchTerm && res.body.searchTerm.trim()) : null,
        currentListingSeoKey: isSearch ? undefined : seoKeywordOrCategoryIdOrSearchTerm,
        currentListingId: breadCrumbs ? breadCrumbs[breadCrumbs.length - 1].value : '',
        currentListingName: breadCrumbs ? breadCrumbs[breadCrumbs.length - 1].label : '',
        currentListingTitle: metaData ? metaData.title : '',
        currentListingShortDescription: metaData ? metaData.metaDesc : '',
        currentListingDescription: metaData ? metaData.longDesc : '',
        currentListingType: categoryType, // need to store it because it will be needed to patch the information when getting additional product information
        isDepartment: isDepartment,
        // An L2 can be an outfits page, if so we need to store the 3rd party tag associated with this outfits page
        outfitStyliticsTag: STYLITICS_OUTFIT_TAGS[seoKeywordOrCategoryIdOrSearchTerm] ||
          breadCrumbs && breadCrumbs.length === 2 && breadCrumbs[1].label === 'Outfits' && STYLITICS_OUTFIT_TAGS[breadCrumbs[0].label], // fall back on breadcrumbs if the user gets to outfits by none seo key word

        totalProductsCount: isDepartment ? 0 : res.body.recordSetTotalMatches,

        filtersMaps: {
          colors: isDepartment || !colorsFilterMap
            ? []
            : colorsFilterMap.entry.map((color) => ({
              displayName: color.label,
              imagePath: `/wcsstore/GlobalSAS/images/tcp/category/color-swatches/${color.label}.gif`,
              id: color.value
            })),

          sizes: isDepartment || !sizesFilterMap
            ? []
            : sizesFilterMap.entry.map((size) => ({
              displayName: size.label,
              id: size.value
            })),

          departments: isDepartment || !departmentsFiltersMap
          ? []
          : departmentsFiltersMap.map((category) => ({
            displayName: category.label,
            id: category.value
          })),

          subDepartments: isDepartment || !subDepartmentsFiltersMap
          ? []
          : subDepartmentsFiltersMap.map((category) => ({
            displayName: category.label,
            id: category.value
          }))
        },

        navitagionTree: (res.body.siblingCategories && res.body.siblingCategories.childCategoriesList) ? res.body.siblingCategories.childCategoriesList
          .map((nav) => ({
            categoryId: nav.catgroup_id,
            name: nav.name,
            plpPath: nav.seoURL,      // nav.seo_token_ntk || nav.catgroup_id,
            children: nav.childCategoriesList
              ? nav.childCategoriesList
                  .map((subNav) => ({
                    categoryId: subNav.catgroup_id,
                    name: subNav.name,
                    plpPath: subNav.seoURL      // nav.seo_token_ntk || nav.catgroup_id
                  }))
              : []
          })) : [],

        breadCrumbTrail: breadCrumbs ? breadCrumbs
          .map((crumb) => ({
            displayName: crumb.label,
            urlPathSuffix: crumb.seo_token_ntk
          })) : [],

        appliedFiltersIds: {
          colors: isDepartment || !colorsFilterMap ? []
            : colorsFilterMap.entry.filter((color) => colorFilterIdsList.indexOf(color.value) > -1).map((color) => color.value),

          sizes: isDepartment || !sizesFilterMap ? []
            : sizesFilterMap.entry.filter((size) => sizeFiltersIdsList.indexOf(size.value) > -1).map((size) => size.value),

          departments: isDepartment || !departmentsFiltersMap ? []
            : departmentsFiltersMap.filter((cat) => departmentFiltersIdsList.indexOf(cat.value) > -1).map((cat) => cat.value),

          subDepartments: isDepartment || !subDepartmentsFiltersMap ? []
            : subDepartmentsFiltersMap.filter((cat) => subDepartmentFiltersIdsList.indexOf(cat.value) > -1).map((cat) => cat.value)
        },

        appliedSortId: sortId,

        loadedProducts: []
      };

      if (!isDepartment) {
        res.body.catalogEntryView.forEach((product, index) => {
          let colors = extractAttributeValue(product, attributesNames.swatches);
          let defaultColor = product.auxDescription1;
          let imagesByColor = {
            [defaultColor]: {
              extraImages: []
            }
          };
          let colorsMap = [{
            colorProductId: product.partNumber,
            miscInfo: {
              isBopisEligible: parseBoolean(product.ISBOPIS),
              badge1: extractPrioritizedBadge(product, attributesNames, categoryType),
              badge2: extractAttributeValue(product, attributesNames.extendedSize),
              badge3: extractAttributeValue(product, attributesNames.merchant)
            },
            color: {
              name: defaultColor,
              imagePath: getImgPath(product.partNumber).colorSwatch
            }
          }];

          if (colors) {
            colors.split('|').forEach((color) => {
              let colorDetails = color.split('#');

              // the default/selected one is already there
              if (colorDetails[0] !== product.partNumber) {
                imagesByColor[colorDetails[1]] = {
                  extraImages: []
                };

                if (colorDetails[0] === product.partNumber) {
                  defaultColor = colorDetails[1];
                }

                colorsMap.push({
                  colorProductId: colorDetails[0],
                  miscInfo: {},
                  color: {
                    name: colorDetails[1],
                    imagePath: getImgPath(colorDetails[0]).colorSwatch
                  }
                });
              }
            });
          }

          let categoryName;
          // current product is product[i]
          if (product.parentCatGroupIdForProduct && parentCategories) {
            // go through the category list returned from the api
            for (let category of parentCategories) {
              // if product[i]'s parentCatGroupIdForProduct is in the category list set this products categoryName to that
              // if product[i]'s parentCatGroupIdForProduct does not match this category it could be that this category has children so check those in the else if
              if (product.parentCatGroupIdForProduct.find((productCategory) => category.catgroup_id.toString() === productCategory)) {
                categoryName = category.name;
              } else if (category.childCategoriesList) {
                categoryName = (category.childCategoriesList.find((subcategory) => !!product.parentCatGroupIdForProduct.find((productCategory) => subcategory.catgroup_id.toString() === productCategory)) || {}).name;
              }
            }
          }

          response.loadedProducts.push({
            productInfo: {
              generalProductId: product.uniqueID,
              name: product.name,
              pdpUrl: `/${this.apiHelper.configOptions.siteId}/p/${product.seo_token_ntk || product.uniqueID}`,
              shortDescription: product.shortDescription,
              longDescription: product.shortDescription,
              isGiftCard: parseBoolean(product.isGiftProduct),
              listPrice: parseFloat((product.price && product.price.find((attr) => attr.usage === 'Display') || {value: null}).value) || parseFloat((product.price && product.price.find((attr) => attr.usage === 'Offer') || {value: null}).value) || 0,
              offerPrice: parseFloat((product.price && product.price.find((attr) => attr.usage === 'Offer') || {value: null}).value) || 0
            },

            miscInfo: {
              rating: parseFloat(extractAttributeValue(product, 'TCPBazaarVoiceRating')) || 0,
              // yet again, we need to dig from multiple sources just to get a simple string value
              categoryName: categoryName
            },

            colorsMap: colorsMap,

            imagesByColor: imagesByColor
          });

          for (let colorEntry of colorsMap) {
            /* DT-31099
            pendingPromises.push(
              getExtraImages (colorEntry.colorProductId, (defaultColor !== colorEntry.color.name) ? [''] : null)
              .then((extraImages) => {
                if (extraImages.length === 0) {
                  extraImages = [{
                    iconSizeImageUrl: '/wcsstore/static/images/im_NotFound.svg',
                    listingSizeImageUrl: '/wcsstore/static/images/im_NotFound.svg',
                    regularSizeImageUrl: '/wcsstore/static/images/im_NotFound.svg',
                    bigSizeImageUrl: '/wcsstore/static/images/im_NotFound.svg',
                    superSizeImageUrl: '/wcsstore/static/images/im_NotFound.svg'
                  }];
                }
                response.loadedProducts[index].imagesByColor[colorEntry.color.name].extraImages = extraImages;
              })
            );
            */

            let { productImages } = getImgPath(colorEntry.colorProductId);

            response.loadedProducts[index].imagesByColor[colorEntry.color.name].extraImages = [{
              iconSizeImageUrl: productImages[125],
              listingSizeImageUrl: productImages[380],
              regularSizeImageUrl: productImages[500],
              bigSizeImageUrl: productImages[900],
              superSizeImageUrl: productImages[900]
            }];
          }

        });
      }

      return Promise.all(pendingPromises).then(() => response);
    }).catch((err) => {
      throw this.apiHelper.getFormattedError(err);
    });
  }

  getCustomCategoryListingPage (seoKeywordOrCategoryIdOrSearchTerm, isSearch, filtersAndSort, pageNumber, extaQueryValues, getImgPath) {
    let {colorFilterIdsList = [], sizeFiltersIdsList = [], departmentFiltersIdsList = [], subDepartmentFiltersIdsList = [], sortId = null} = filtersAndSort;
    // BE currently supports only one department or one sub-department filter (but not both)
    let categoryFilter = subDepartmentFiltersIdsList.length
      ? subDepartmentFiltersIdsList.join(',')           // sub-department filter has higher priority than departmernt filter (if it exists)
      : departmentFiltersIdsList.join(',');

    let payload = {
      header: {
        pageNumber: pageNumber,
        searchType: '-1,-1,0', // Hard Coded this means we want products and not outfits
        pageSize: PRODUCTS_PER_LOAD,
        searchSource: 'E', // hardcode value backend needs for some reason
        facet: [].concat(colorFilterIdsList).concat(sizeFiltersIdsList).join(',')
        // facet: 'color:' + colorFilterIdsList.join(',') + '&' + 'size:' + sizeFiltersIdsList.join(',') // FIXME: backend does not support this yet
      },
      body: {
        ...extaQueryValues,
        departments: departmentFiltersIdsList.join(',')
      },
      webService: isSearch ? endpoints.getProductsBySearchTerm : endpoints.getProductviewbyCategory
    };
    if (!isSearch || categoryFilter) payload.header.categoryId = isSearch ? categoryFilter : seoKeywordOrCategoryIdOrSearchTerm;
    if (isSearch) payload.header.searchTerm = seoKeywordOrCategoryIdOrSearchTerm || '*';
    if (sortId) payload.header.orderBy = sortId;

    return axios.get('https://p8ll4.mocklab.io/')
    .then((res) => { 
      console.log(res.data)
    res.body = res.data;
    // return this.apiHelper.webServiceCall(payload).then((res) => {
    //   if (this.apiHelper.responseContainsErrors(res)) {
    //     throw new ServiceResponseError(res);
    //   }

      let pendingPromises = [];
      let breadCrumbs = res.body.breadCrumbTrailEntryView;
      // flags if we are oin an L1 plp. Such plp's have no products, and only show espots and recommendations.
      let isDepartment = !isSearch && (!breadCrumbs || breadCrumbs.length <= 1);
      let attributesNames = this.getProductAttributes();

      let colorsFilterMap = res.body.facetView && res.body.facetView.find((attr) => attr.name === 'Color');
      let sizesFilterMap = res.body.facetView && res.body.facetView.find((attr) => attr.name === attributesNames.sizes);
      let categoryType = res.body.listingSearchType; // TBD: backend to return the category type (clearance, new arrival, etc)
      let departmentsFiltersMap = res.body.categoryType;
      // BE, in their infinite wisdom, send L2 categories only when they send us a single L1 option, and they nest it inside it.
      let subDepartmentsFiltersMap = res.body.categoryType && res.body.categoryType.length > 0 && res.body.categoryType[0].entry;
      let parentCategories = (res.body.siblingCategories && res.body.siblingCategories.childCategoriesList);
      let metaData = res.body.metaData;

      let response = {
        currentListingSearchForText: isSearch ? (res.body.searchTerm && res.body.searchTerm.trim()) : null,
        currentListingSeoKey: isSearch ? undefined : seoKeywordOrCategoryIdOrSearchTerm,
        currentListingId: breadCrumbs ? breadCrumbs[breadCrumbs.length - 1].value : '',
        currentListingName: breadCrumbs ? breadCrumbs[breadCrumbs.length - 1].label : '',
        currentListingTitle: metaData ? metaData.title : '',
        currentListingShortDescription: metaData ? metaData.metaDesc : '',
        currentListingDescription: metaData ? metaData.longDesc : '',
        currentListingType: categoryType, // need to store it because it will be needed to patch the information when getting additional product information
        isDepartment: isDepartment,
        // An L2 can be an outfits page, if so we need to store the 3rd party tag associated with this outfits page
        outfitStyliticsTag: STYLITICS_OUTFIT_TAGS[seoKeywordOrCategoryIdOrSearchTerm] ||
          breadCrumbs && breadCrumbs.length === 2 && breadCrumbs[1].label === 'Outfits' && STYLITICS_OUTFIT_TAGS[breadCrumbs[0].label], // fall back on breadcrumbs if the user gets to outfits by none seo key word

        totalProductsCount: isDepartment ? 0 : res.body.recordSetTotalMatches,

        filtersMaps: {
          colors: isDepartment || !colorsFilterMap
            ? []
            : colorsFilterMap.entry.map((color) => ({
              displayName: color.label,
              imagePath: `/wcsstore/GlobalSAS/images/tcp/category/color-swatches/${color.label}.gif`,
              id: color.value
            })),

          sizes: isDepartment || !sizesFilterMap
            ? []
            : sizesFilterMap.entry.map((size) => ({
              displayName: size.label,
              id: size.value
            })),

          departments: isDepartment || !departmentsFiltersMap
          ? []
          : departmentsFiltersMap.map((category) => ({
            displayName: category.label,
            id: category.value
          })),

          subDepartments: isDepartment || !subDepartmentsFiltersMap
          ? []
          : subDepartmentsFiltersMap.map((category) => ({
            displayName: category.label,
            id: category.value
          }))
        },

        navitagionTree: (res.body.siblingCategories && res.body.siblingCategories.childCategoriesList) ? res.body.siblingCategories.childCategoriesList
          .map((nav) => ({
            categoryId: nav.catgroup_id,
            name: nav.name,
            plpPath: nav.seoURL,      // nav.seo_token_ntk || nav.catgroup_id,
            children: nav.childCategoriesList
              ? nav.childCategoriesList
                  .map((subNav) => ({
                    categoryId: subNav.catgroup_id,
                    name: subNav.name,
                    plpPath: subNav.seoURL      // nav.seo_token_ntk || nav.catgroup_id
                  }))
              : []
          })) : [],

        breadCrumbTrail: breadCrumbs ? breadCrumbs
          .map((crumb) => ({
            displayName: crumb.label,
            urlPathSuffix: crumb.seo_token_ntk
          })) : [],

        appliedFiltersIds: {
          colors: isDepartment || !colorsFilterMap ? []
            : colorsFilterMap.entry.filter((color) => colorFilterIdsList.indexOf(color.value) > -1).map((color) => color.value),

          sizes: isDepartment || !sizesFilterMap ? []
            : sizesFilterMap.entry.filter((size) => sizeFiltersIdsList.indexOf(size.value) > -1).map((size) => size.value),

          departments: isDepartment || !departmentsFiltersMap ? []
            : departmentsFiltersMap.filter((cat) => departmentFiltersIdsList.indexOf(cat.value) > -1).map((cat) => cat.value),

          subDepartments: isDepartment || !subDepartmentsFiltersMap ? []
            : subDepartmentsFiltersMap.filter((cat) => subDepartmentFiltersIdsList.indexOf(cat.value) > -1).map((cat) => cat.value)
        },

        appliedSortId: sortId,

        loadedProducts: []
      };

      if (!isDepartment) {
        res.body.catalogEntryView.forEach((product, index) => {
          let colors = extractAttributeValue(product, attributesNames.swatches);
          let defaultColor = product.auxDescription1;
          let imagesByColor = {
            [defaultColor]: {
              extraImages: []
            }
          };
          let colorsMap = [{
            colorProductId: product.partNumber,
            miscInfo: {
              isBopisEligible: parseBoolean(product.ISBOPIS),
              badge1: extractPrioritizedBadge(product, attributesNames, categoryType),
              badge2: extractAttributeValue(product, attributesNames.extendedSize),
              badge3: extractAttributeValue(product, attributesNames.merchant)
            },
            color: {
              name: defaultColor,
              imagePath: getImgPath(product.partNumber).colorSwatch
            }
          }];

          if (colors) {
            colors.split('|').forEach((color) => {
              let colorDetails = color.split('#');

              // the default/selected one is already there
              if (colorDetails[0] !== product.partNumber) {
                imagesByColor[colorDetails[1]] = {
                  extraImages: []
                };

                if (colorDetails[0] === product.partNumber) {
                  defaultColor = colorDetails[1];
                }

                colorsMap.push({
                  colorProductId: colorDetails[0],
                  miscInfo: {},
                  color: {
                    name: colorDetails[1],
                    imagePath: getImgPath(colorDetails[0]).colorSwatch
                  }
                });
              }
            });
          }

          let categoryName;
          // current product is product[i]
          if (product.parentCatGroupIdForProduct && parentCategories) {
            // go through the category list returned from the api
            for (let category of parentCategories) {
              // if product[i]'s parentCatGroupIdForProduct is in the category list set this products categoryName to that
              // if product[i]'s parentCatGroupIdForProduct does not match this category it could be that this category has children so check those in the else if
              if (product.parentCatGroupIdForProduct.find((productCategory) => category.catgroup_id.toString() === productCategory)) {
                categoryName = category.name;
              } else if (category.childCategoriesList) {
                categoryName = (category.childCategoriesList.find((subcategory) => !!product.parentCatGroupIdForProduct.find((productCategory) => subcategory.catgroup_id.toString() === productCategory)) || {}).name;
              }
            }
          }

          response.loadedProducts.push({
            productInfo: {
              generalProductId: product.uniqueID,
              name: product.name,
              pdpUrl: `/${this.apiHelper.configOptions.siteId}/p/${product.seo_token_ntk || product.uniqueID}`,
              shortDescription: product.shortDescription,
              longDescription: product.shortDescription,
              isGiftCard: parseBoolean(product.isGiftProduct),
              listPrice: parseFloat((product.price && product.price.find((attr) => attr.usage === 'Display') || {value: null}).value) || parseFloat((product.price && product.price.find((attr) => attr.usage === 'Offer') || {value: null}).value) || 0,
              offerPrice: parseFloat((product.price && product.price.find((attr) => attr.usage === 'Offer') || {value: null}).value) || 0
            },

            miscInfo: {
              rating: parseFloat(extractAttributeValue(product, 'TCPBazaarVoiceRating')) || 0,
              // yet again, we need to dig from multiple sources just to get a simple string value
              categoryName: categoryName
            },

            colorsMap: colorsMap,

            imagesByColor: imagesByColor
          });

          for (let colorEntry of colorsMap) {
            /* DT-31099
            pendingPromises.push(
              getExtraImages (colorEntry.colorProductId, (defaultColor !== colorEntry.color.name) ? [''] : null)
              .then((extraImages) => {
                if (extraImages.length === 0) {
                  extraImages = [{
                    iconSizeImageUrl: '/wcsstore/static/images/im_NotFound.svg',
                    listingSizeImageUrl: '/wcsstore/static/images/im_NotFound.svg',
                    regularSizeImageUrl: '/wcsstore/static/images/im_NotFound.svg',
                    bigSizeImageUrl: '/wcsstore/static/images/im_NotFound.svg',
                    superSizeImageUrl: '/wcsstore/static/images/im_NotFound.svg'
                  }];
                }
                response.loadedProducts[index].imagesByColor[colorEntry.color.name].extraImages = extraImages;
              })
            );
            */

            let { productImages } = getImgPath(colorEntry.colorProductId);

            response.loadedProducts[index].imagesByColor[colorEntry.color.name].extraImages = [{
              iconSizeImageUrl: productImages[125],
              listingSizeImageUrl: productImages[380],
              regularSizeImageUrl: productImages[500],
              bigSizeImageUrl: productImages[900],
              superSizeImageUrl: productImages[900]
            }];
          }

        });
      }

      return Promise.all(pendingPromises).then(() => response);
    }).catch((err) => {
      throw this.apiHelper.getFormattedError(err);
    });
  }

  getExtraImagesForProduct (product, imageGenerator) {
    // note: productsList is immutable
    let pendingPromises = [];
    let imagesByColor = {};

    product.colorFitsSizesMap.forEach((colorEntry) => {

      pendingPromises.push(
        getExtraImages(colorEntry.colorDisplayId, false, imageGenerator)
        .then((extraImages) => {
          imagesByColor[colorEntry.color.name] = {
            ...product.imagesByColor[colorEntry.color.name],
            extraImages: extraImages
          };
        })
      );
    });

    return Promise.all(pendingPromises).then(() => imagesByColor);
  }

  getExtraImagesForProductsList (productsList, imageGenerator) {
    // note: productsList is immutable
    let pendingPromises = [];
    let updatedProducts = [];

    productsList.forEach((product, index) => {
      updatedProducts[index] = {...product};
      product.colorsMap.forEach((colorEntry) => {
        pendingPromises.push(
          getExtraImages(colorEntry.colorProductId, false, imageGenerator)
          .then((extraImages) => {
            updatedProducts[index] = {
              ...updatedProducts[index],
              imagesByColor: {
                ...updatedProducts[index].imagesByColor,
                [colorEntry.color.name]: {
                  ...updatedProducts[index].imagesByColor[colorEntry.color.name],
                  extraImages: extraImages
                }
              }
            };
          })
        );
      });
    });

    return Promise.all(pendingPromises).then(() => updatedProducts);
  }

  getProductAttributes () {
    let isUSStore = this.apiHelper.configOptions.isUSStore;
    return isUSStore
      ? {
        merchant: 'TCPMerchantTagUSStore',
        sizes: 'TCPSizeUSStore',
        swatches: 'TCPSwatchesUSStore',
        onlineOnly: 'TCPWebOnlyFlagUSStore',
        clearance: 'TCPProductIndUSStore',
        inventory: 'TCPInventoryFlagUSStore',
        glowInTheDark: 'TCPGlowInDarkUSStore',
        limitedQuantity: 'TCPInventoryMessageUSStore',
        extendedSize: 'TCPFitMessageUSStore'
      }
      : {
        merchant: 'TCPMerchantTagCanadaStore',
        sizes: 'TCPSizeCanadaStore',
        swatches: 'TCPSwatchesCanadaStore',
        onlineOnly: 'TCPWebOnlyFlagCanadaStore',
        clearance: 'TCPProductIndCanadaStore',
        inventory: 'TCPInventoryFlagCanadaStore',
        glowInTheDark: 'TCPGlowInDarkUCanadaStore',
        limitedQuantity: 'TCPInventoryMessageCanadaStore',
        extendedSize: 'TCPFitMessageCanadaStore'
      };
  }

  parseProductFromAPI (product, colorIdOrSeoKeyword, dontFetchExtraImages, getImgPath) {
    let productColorsRaw = product.components || [];
    let isGiftCard = product.name === 'GiftCardBundle' || product.partNumber === 'giftCardBundle'; // TBD: backend to confirm whether partNumber will always be giftCardBundle for gift cards.
    let productAttributes = this.getProductAttributes();
    let hasFit = false;

    // The bread crumbs is stored at the color level so i extract the first one
    // FIXME: Backend to update their API to support this again -> https://childrensplace.atlassian.net/browse/DT-27198.
    let breadCrumbTrail = (productColorsRaw.length && productColorsRaw[0].breadCrumbTrailEntryView && productColorsRaw[0].breadCrumbTrailEntryView.length)
      ? productColorsRaw[0].breadCrumbTrailEntryView[0].map((crumb) => (
        {
          displayName: crumb.label,
          urlPathSuffix: crumb.seo_token_ntk || crumb.value
        }))
      : [];

    // This color map is used as an intermediary step to help consolidate all sizes under fits
    let colorsFitsMap = {};

    for (let itemColor of productColorsRaw) {
      let color = itemColor.auxDescription1 || extractAttributeValue(itemColor, 'TCPColor') || itemColor.name;
      let currentColorFitsSizesMap = {};

      for (let sku of itemColor.sKUs) {
        let fitName = extractAttributeValue(sku, 'TCPFit');
        if (fitName) {
          hasFit = true;
        }
        if (!currentColorFitsSizesMap[fitName]) {
          currentColorFitsSizesMap[fitName] = [];
        }

        currentColorFitsSizesMap[fitName].push({
          sizeName: extractAttributeValue(sku, 'TCPSize') || sku.name,
          skuId: sku.uniqueID,
          listPrice: parseFloat((sku.price.find((attr) => attr.usage === 'Display') || {value: null}).value) || parseFloat((sku.price.find((attr) => attr.usage === 'Offer') || {value: null}).value) || 0,
          offerPrice: parseFloat((sku.price.find((attr) => attr.usage === 'Offer') || {value: null}).value) || 0,
          maxAvailable: extractAttributeValue(itemColor, productAttributes.inventory) === '0' ? 0 : Number.MAX_VALUE
        });
      }

      let hasDefaultFit = false;

      let sortOptions = {
        regular: 1,
        slim: 2,
        plus: 3,
        husky: 4,
        other: 5
      };
      let sortedKeys = Object.keys(currentColorFitsSizesMap).sort((a, b) => (sortOptions[a.toLowerCase()] || sortOptions.other) - (sortOptions[b.toLowerCase()] || sortOptions.other));

      colorsFitsMap[color] = sortedKeys.map((fitName) => {
        let isDefaultFit = fitName.toLowerCase() === 'regular';
        hasDefaultFit = hasDefaultFit || isDefaultFit;

        return {
          fitName: fitName,
          isDefault: isDefaultFit,
          maxAvailable: extractAttributeValue(itemColor, productAttributes.inventory) === '0' ? 0 : Number.MAX_VALUE,
          sizes: convertMultipleSizeSkusToAlternatives(currentColorFitsSizesMap[fitName])
        };
      });

      if (!hasDefaultFit && colorsFitsMap[color].length) {
        colorsFitsMap[color][0].isDefault = true;
      }
    }

    // Generate the colorFitsSizeMap needed for mapping colors to fits/sizes

    let attributesNames = this.getProductAttributes();

    let colorFitsSizesMap = productColorsRaw.map((itemColor) => {
      let colorFamily = extractAttributeValue(itemColor, 'TCPColor');
      let {productImages, colorSwatch} = getImgPath(itemColor.partNumber);

      return {
        color: {
          name: itemColor.auxDescription1 || colorFamily || itemColor.name,
          imagePath: isGiftCard ? productImages[125] : colorSwatch,
          family: colorFamily
        },
        colorProductId: itemColor.uniqueID,
        colorDisplayId: itemColor.partNumber, // We need this to display on PDP as well as to send to api for recommendations
        favoritedCount: -1, // We get this when we call inventory API
        maxAvailable: extractAttributeValue(itemColor, 'TCPInventoryFlagUSStore') === '0' ? 0 : Number.MAX_VALUE,
        hasFits: hasFit,
        miscInfo: {
          isBopisEligible: parseBoolean(itemColor.ISBOPIS),
          badge1: extractPrioritizedBadge(itemColor, attributesNames)
        },
        fits: colorsFitsMap[itemColor.auxDescription1 || extractAttributeValue(itemColor, 'TCPColor') || itemColor.name],
        listPrice: parseFloat((itemColor.price.find((attr) => attr.usage === 'Display') || {value: null}).value) || parseFloat((itemColor.price.find((attr) => attr.usage === 'Offer') || {value: null}).value) || 0,
        offerPrice: parseFloat((itemColor.price.find((attr) => attr.usage === 'Offer') || {value: null}).value) || 0
      };
    });

    // Filter out the Image Information needed for PDP
    let imagesByColor = {};
    let pendingPromises = [];
    for (let itemColor of productColorsRaw) {
      let color = itemColor.auxDescription1 || extractAttributeValue(itemColor, 'TCPColor') || itemColor.name;
      let partNumber = itemColor.partNumber;
      let { productImages } = getImgPath(partNumber);

      // Nov.16, 2017: we are now assured that the first (no dash number) images always exist
      let basicImageUrl = productImages[500];
      if (!dontFetchExtraImages) {
        imagesByColor[color] = {
          basicImageUrl,
          extraImages: [{
            iconSizeImageUrl: productImages[125],
            listingSizeImageUrl: productImages[380],
            regularSizeImageUrl: productImages[500],
            bigSizeImageUrl: productImages[900],
            superSizeImageUrl: productImages[900]
          }]
        };
      } else {
        imagesByColor[color] = {
          basicImageUrl,
          extraImages: []
        };
      }
      // Code before assurance that first image always exists
      //   pendingPromises.push(
      //     (dontFetchExtraImages ? Promise.resolve([]) : getExtraImages (partNumber, urlPrefix, ['']))
      //     .then((extraImages) => {
      //       let basicImageUrl = `/wcsstore/GlobalSAS/images/tcp/products/500/${partNumber}.jpg`;
      //       if (extraImages.length === 0 && !dontFetchExtraImages) {
      //         basicImageUrl = '/wcsstore/static/images/im_NotFound.svg';
      //         extraImages = [{
      //           iconSizeImageUrl: '/wcsstore/static/images/im_NotFound.svg',
      //           listingSizeImageUrl: '/wcsstore/static/images/im_NotFound.svg',
      //           regularSizeImageUrl: '/wcsstore/static/images/im_NotFound.svg',
      //           bigSizeImageUrl: '/wcsstore/static/images/im_NotFound.svg',
      //           superSizeImageUrl: '/wcsstore/static/images/im_NotFound.svg'
      //         }];
      //       }
      //
      //       imagesByColor[color] = {
      //         basicImageUrl: basicImageUrl,
      //         extraImages: extraImages
      //       };
      //     }));

    }

    return Promise.all(pendingPromises)
    .then(() => ({
      breadCrumbTrail: breadCrumbTrail,
      product: { // generalProductId = color with matching seo OR colorIdOrSeoKeyword is its a number OR default to first color's ID (To Support Outfits)
        ratingsProductId: product.partNumber, // this is needed to initialize BazaarVoice
        // generalProductId = color with matching seo OR colorIdOrSeoKeyword is its a number OR default to first color's ID (To Support Outfits)
        generalProductId: (productColorsRaw.find((item) => item.seo_token_ntk === colorIdOrSeoKeyword) ||
          {uniqueID: (colorIdOrSeoKeyword !== null && !isNaN(colorIdOrSeoKeyword))
          ? colorIdOrSeoKeyword
          : colorFitsSizesMap[0] && colorFitsSizesMap[0].colorProductId || product.uniqueID}).uniqueID,
        name: isGiftCard ? 'Gift Card' : product.name,
        pdpUrl: `/${this.apiHelper.configOptions.siteId}/p/${colorIdOrSeoKeyword}`,
        shortDescription: product.shortDescription,
        longDescription: product.longDescription,
        imagesByColor: imagesByColor,
        colorFitsSizesMap: colorFitsSizesMap,
        isGiftCard: isGiftCard,
        colorFitSizeDisplayNames: isGiftCard ? {color: 'Design', size: 'Value (USD)'} : null,
        listPrice: parseFloat((product.price.find((attr) => attr.usage === 'Display') || {value: null}).value) || parseFloat((product.price.find((attr) => attr.usage === 'Offer') || {value: null}).value) || 0,
        offerPrice: parseFloat((product.price.find((attr) => attr.usage === 'Offer') || {value: null}).value) || 0
      }
    })).catch((err) => {
      throw err;
    });
  }

  /**
   * @function getMultipleInventoryAndFavoritsCount
   * @param {String<array>} generalProductIdsList
   * @summary This function accepts an array of product Ids and will return an object indexed by those ids holding inventory and favorit informaiton
   */
  getMultipleInventoryAndFavoritsCount (generalProductIdsList) {
    let payload = {
      header: {
      },
      body: {
        productId: generalProductIdsList
      },
      webService: endpoints.getInventoryForOutfits
    };

    return this.apiHelper.webServiceCall(payload).then((res) => {
      if (this.apiHelper.responseContainsErrors(res)) {
        throw new ServiceResponseError(res);
      }

      let rawProductArray = res.body;
      let productMap = {};

      for (let productObject of rawProductArray) {
        let productId = Object.keys(productObject)[0];
        let rawProductInfo = productObject[productId];
        let favCounter = rawProductInfo.getProductCounter;

        productMap[productId] = {
          // isInDefaultWishlist: rawProductInfo.isInDefaultWishlist, // Need to engadge another service for this
          favoritesCounter: parseInt(favCounter && (favCounter.counter || (favCounter[0] && favCounter[0].counter))) || 0,
          inventory: rawProductInfo.getAllSKUInventoryByProductId.response.map((inventory) => ({
            skuId: inventory.catentryId,
            inventory: parseInt(inventory.quantity)
          }))
        };
      }

      return productMap;
    }).catch((err) => {
      throw this.apiHelper.getFormattedError(err);
    });
  }
}

function getGiftCardColorsAndSizes (apiHelper, responseBody) {
  let result = [];
  // note that currently we get only one productId per gift card; i.e., only one design (called 'color' for other items)
  // however, we loop here to accomodate the possibility that future gift cards may return multiple possble designs
  for (let productId of Object.keys(responseBody)) {
    let currentColor = responseBody[productId];
    let sizes = Object.values(currentColor.Size).map((sizeObj) => ({
      maxAvailable: sizeObj[Object.keys(sizeObj)[0]].qty,
      skuId: Object.keys(sizeObj)[0],
      sizeName: sizeObj[Object.keys(sizeObj)[0]].TCPSize
    }));
    // get the maximum maxAvailable value in the sizes array
    let maxAvailable = sizes.reduce((max, size) => size.maxAvailable > max ? size.maxAvailable : max, 0);

    result.push({
      colorProductId: productId,
      color: {
        name: currentColor.productName.trim()
      },
      maxAvailable: maxAvailable,
      hasFits: false,
      fits: [{
        fitName: '',
        maxAvailable: maxAvailable,
        sizes: sizes
      }]
    });
  }
  return result;
}

function getRegularItemColorsAndSizes (apiHelper, responseBody, swatchImgGenerator) {
  let colorAndSizes = [];
  // Color Level
  for (let productId of Object.keys(responseBody)) {
    let currentColor = responseBody[productId];
    let fitMap = {};
    let colorDetails = {
      colorProductId: productId,
      color: {
        name: currentColor.Color,
        imagePath: swatchImgGenerator(currentColor.Thumbnail)
      },

      maxAvailable: Number.MAX_VALUE,
      hasFits: !!((currentColor.Size[Object.keys(currentColor.Size)[0]] || {}).TCPFit),
      fits: []
    };

    // Size/Fit Level
    for (let catalogEntryId of Object.keys(currentColor.Size)) {
      let currentFit = currentColor.Size[catalogEntryId].TCPFit;
      let currentSize = currentColor.Size[catalogEntryId].TCPSize;
      let arrayOrder = currentColor.Size[catalogEntryId].Order;

      // if this map has not been created initalize it
      fitMap[currentFit] = fitMap[currentFit] ? fitMap[currentFit] : {};

      // Cook an object, key will be the name of the fit, then append size to it
      if (!fitMap[currentFit].sizes) {
        fitMap[currentFit].sizes = [];
      }

      fitMap[currentFit].sizes.push({
        sizeName: currentSize,
        skuId: catalogEntryId,
        maxAvailable: Number.MAX_VALUE,
        order: arrayOrder
      });
    }

    // Now that we have the fits map we can make an array of object, each object in this array will be a fit, with all sizes as an array
    for (let fitName of Object.keys(fitMap)) {
      colorDetails.fits.push({
        fitName: fitName,
        maxAvailable: Number.MAX_VALUE,
        sizes: convertMultipleSizeSkusToAlternatives(
          fitMap[fitName].sizes
          .sort((prevSize, curSize) => { return prevSize.order - curSize.order; })
          .map((size) => ({
            sizeName: size.sizeName,
            skuId: size.skuId,
            maxAvailable: Number.MAX_VALUE
          }))
        )
      });
    }

    // Now put it all together like a good lasagna
    colorAndSizes.push(colorDetails);
  }
  return colorAndSizes;
}

function extractAttributeValue (item, attribute) {
  try {
    return (item.attributes.find((att) => att.identifier === attribute) || {values: [{value: null}]}).values[0].value;
  } catch (ex) {
    return '';
  }
}

/** - - - - - - - - - - - - - - - PRIVATE METHODS - - - - - - - - - - - -  **/

function getExistingImagesNames (imageSuffixesArray, baseUrl, imagePrefix) {
  /*
  Since the backend won't to return existing images associated with a product as part of the web service response,
  we've been forced to create a matrix by requesting ALL permuatation through a head request (to each image),
  should the target (icon) exist, we store it in the result array of suffixes.
  */
  const NOP = () => null;
  let request = require('superagent');
  let pendingPromises = [];
  let foundImagesMap = {};
  imageSuffixesArray.forEach((suffix) => {
    pendingPromises.push(
        /** we're going for the icons, and assuming: if the icon exists the images should be available in all other sizes as well  */
      request.head(baseUrl.replace(imagePrefix, `${imagePrefix}${suffix}`))
      .timeout({
        response: 3000,  // Wait 3 seconds for the server to start sending,
        deadline: 3000 // but allow 3 seconds for the file to finish loading.
      })
      .then((res) => {
        if (res.ok) {
          foundImagesMap[suffix] = true; // changed from push() to keep the same order as it came in imageSuffixesArray
        }
      }).catch(NOP)        // ignore any failures (we simply do not increment foundImagesCount)
    );
  });
  return Promise.all(pendingPromises).then(() => imageSuffixesArray.filter((suffix) => foundImagesMap[suffix]));
}

export function getExtraImages (partNumber, extraSizes, imageGenerator) {

  let { productImages } = imageGenerator(partNumber);

  // If this is not on server then no other suffixed images will be there
  let baseImage = productImages[125];

  return getExistingImagesNames(extraSizes || ['', '-1', '-2', '-3', '-4', '-5'], baseImage, partNumber)
  .then((existingSuffixes) =>
    existingSuffixes.map((suffix) => ({
      iconSizeImageUrl: productImages[125].replace(partNumber, `${partNumber}${suffix}`),
      listingSizeImageUrl: productImages[380].replace(partNumber, `${partNumber}${suffix}`),
      regularSizeImageUrl: productImages[500].replace(partNumber, `${partNumber}${suffix}`),
      bigSizeImageUrl: productImages[900].replace(partNumber, `${partNumber}${suffix}`),
      superSizeImageUrl: productImages[900].replace(partNumber, `${partNumber}${suffix}`)
    }))
  );
}

// DT-708
function extractPrioritizedBadge (product, siteAttributes, categoryType = null) {

  let isGlowInTheDark = parseBoolean(extractAttributeValue(product, siteAttributes.glowInTheDark));
  let isLimitedQuantity = extractAttributeValue(product, siteAttributes.limitedQuantity) === 'limited quantities';
  let isOnlineOnly = parseBoolean(extractAttributeValue(product, siteAttributes.onlineOnly));
  let clearanceOrNewArrival = extractAttributeValue(product, siteAttributes.clearance);

  if (isGlowInTheDark) {
    return 'GLOW-IN-THE-DARK';
  } else if (isLimitedQuantity) {
    return 'JUST A FEW LEFT!';
  } else if (isOnlineOnly && categoryType !== 'Online Only') { // TDB: node missing in service response, need to check it's possible values
    return 'ONLINE EXCLUSIVE';
  } else if (clearanceOrNewArrival === 'Clearance' && categoryType !== 'Clearance') { // TDB: node missing in service response, need to check it's possible values
    return 'CLEARANCE';
  } else if (clearanceOrNewArrival === 'New Arrivals' && categoryType !== 'New Arrivals') { // TDB: node missing in service response, need to check it's possible values
    return 'NEW!';
  }
}

// Due to the infinite wisdom of some of the TCP merchants, some products at the color-fit-size customization level
// (i.e., what is usually considered to be a sku) have received multiple UPC's and SKU id's, each with its own inventory count!
// Such duplicates share the same color and fit as well as size name.
// To address this "multiple SKU problem", this method removes duplicates from the given sizes array by storing (if needed), under the
// key alternativeSkuIds, a list of all the extra sku's for this size. This allows us, when receiving detailed inventory information, to
// identify and use the sku among all the alternatives for which the largest inventory exists, and use this as the primary identifier for this size.
function convertMultipleSizeSkusToAlternatives (sizes) {
  let uniqueSizesMap = Object.create(null);
  let result = [];
  for (let size of sizes) {
    let existingSizeForName = uniqueSizesMap[size.sizeName];
    if (!existingSizeForName) {
      uniqueSizesMap[size.sizeName] = size;
      result.push(size);
    } else {       // size with the same name already encountered
      if (!existingSizeForName.alternativeSkuIds) {
        existingSizeForName.alternativeSkuIds = [];
      }
      if (size.maxAvailable > existingSizeForName.maxAvailable) {
          // make the new skuId the main one, and store the old skuId as an alternative
        existingSizeForName.alternativeSkuIds.push(existingSizeForName.skuId);
        existingSizeForName.skuId = size.skuId;
      } else {
          // store the new skuId as an alternative
        existingSizeForName.alternativeSkuIds.push(size.skuId);
      }
    }
  }
  return result;
}
