/**
@module Product Static Service Abstractors
*/
import {editJsonPopup} from 'util/testUtil/editJsonPopup';

export function getProductsAbstractor () {
  return ProductsStaticAbstractor;
}

const ProductsStaticAbstractor = {
  getInventory (colorProductId) {
    return editJsonPopup('getInventory', [
      {
        skuId: '1',
        inventory: 15
      },
      {
        skuId: '2',
        inventory: 10
      },
      {
        skuId: '3',
        inventory: 1
      },
      {
        skuId: '4',
        inventory: 0
      },
      {
        skuId: '5',
        inventory: 10
      },
      {
        skuId: '6',
        inventory: 10
      },
      {
        skuId: '7',
        inventory: 10
      },
      {
        skuId: '8',
        inventory: 10
      },
      {
        skuId: '9',
        inventory: 10
      }
    ], {colorProductId});
  },

  getInventoryAndFavoritsCount (colorProductId) {
    return editJsonPopup('getInventoryAndFavoritsCount', {
      inventory: [
        {
          skuId: '1',
          inventory: 15
        },
        {
          skuId: '2',
          inventory: 10
        },
        {
          skuId: '3',
          inventory: 1
        },
        {
          skuId: '4',
          inventory: 0
        },
        {
          skuId: '5',
          inventory: 10
        },
        {
          skuId: '6',
          inventory: 10
        },
        {
          skuId: '7',
          inventory: 10
        },
        {
          skuId: '8',
          inventory: 10
        },
        {
          skuId: '9',
          inventory: 10
        }
      ],
      favoritesCounter: 51
    }, {colorProductId});
  },

  getMultipleInventoryAndFavoritsCount (generalProductIdsList) {
    return editJsonPopup('getMultipleInventoryAndFavoritsCount', {
      779586: {
        inventory: [
          {
            skuId: '1',
            inventory: 15
          },
          {
            skuId: '2',
            inventory: 10
          },
          {
            skuId: '3',
            inventory: 1
          },
          {
            skuId: '4',
            inventory: 0
          },
          {
            skuId: '5',
            inventory: 10
          },
          {
            skuId: '6',
            inventory: 10
          },
          {
            skuId: '7',
            inventory: 10
          },
          {
            skuId: '8',
            inventory: 10
          },
          {
            skuId: '9',
            inventory: 10
          }
        ],
        favoritesCounter: 51
      },

      779587: {
        inventory: [
          {
            skuId: '1',
            inventory: 15
          },
          {
            skuId: '2',
            inventory: 10
          },
          {
            skuId: '3',
            inventory: 1
          },
          {
            skuId: '4',
            inventory: 0
          },
          {
            skuId: '5',
            inventory: 10
          },
          {
            skuId: '6',
            inventory: 10
          },
          {
            skuId: '7',
            inventory: 10
          },
          {
            skuId: '8',
            inventory: 10
          },
          {
            skuId: '9',
            inventory: 10
          }
        ],
        favoritesCounter: 1
      },

      779588: {
        inventory: [
          {
            skuId: '1',
            inventory: 15
          },
          {
            skuId: '2',
            inventory: 10
          },
          {
            skuId: '3',
            inventory: 1
          },
          {
            skuId: '4',
            inventory: 0
          },
          {
            skuId: '5',
            inventory: 10
          },
          {
            skuId: '6',
            inventory: 10
          },
          {
            skuId: '7',
            inventory: 10
          },
          {
            skuId: '8',
            inventory: 10
          },
          {
            skuId: '9',
            inventory: 10
          }
        ],
        favoritesCounter: 51
      }

    }, {generalProductIdsList});
  },

  getSwatchesAndSizes (colorProductId) {
    return editJsonPopup('getSwatchesAndSizes', [
      {
        color: {
          imagePath: '/images/colors/red-color.png',
          name: 'Gray Steel'
        },
        colorProductId: '779587',
        hasFits: true,
        maxAvailable: 30,
        fits: [{
          fitName: 'Small',
          maxAvailable: 30,
          sizes: [{
            maxAvailable: 7,
            skuId: 's866748',
            sizeName: 's1'
          },
          {
            maxAvailable: 5,
            skuId: 's867958',
            sizeName: 's2'
          },
          {
            maxAvailable: 0,
            skuId: 's7877944',
            sizeName: 's5'
          }]
        },
        {
          fitName: 'Regular',
          maxAvailable: 7,
          sizes: [{
            maxAvailable: 7,
            skuId: 'r866748',
            sizeName: 'r1'
          },
          {
            maxAvailable: 5,
            skuId: 'r867958',
            sizeName: 'r2'
          },
          {
            maxAvailable: 0,
            skuId: 'r7877944',
            sizeName: 'r3'
          }]
        }]
      }, {
        color: {
          imagePath: '/images/colors/brown-color.png',
          name: 'Gray Steel 2'
        },
        colorProductId: '779587-2',
        hasFits: false,
        maxAvailable: Number.MAX_VALUE,
        fits: [{
          fitName: '',
          maxAvailable: Number.MAX_VALUE,
          sizes: [{
            maxAvailable: Number.MAX_VALUE,
            skuId: 's866748-2',
            sizeName: 's1'
          },
          {
            maxAvailable: Number.MAX_VALUE,
            skuId: 's867958-2',
            sizeName: 's2'
          },
          {
            maxAvailable: Number.MAX_VALUE,
            skuId: 's7877944-2',
            sizeName: 's5uuu'
          }]
        }]
      }
    ], {colorProductId});
  },

  getRecommendations (pageName, itemPartNumberOrDepartmentId, currentPrice) {
    return editJsonPopup('getRecommendations', [
      {
        'currentPrice': 699,
        'imageUrl': 'http://www.childrensplace.com/wcsstore/GlobalSAS/images/tcp/products/500/2074273_10.jpg',
        'originalPrice': 1050,
        'productName': 'Girls Long Sleeve \'Spoiled\' Graphic Tee',
        'productUrl': 'http://www.childrensplace.com/shop/us/p/Girls-Long-Sleeve--Spoiled--Graphic-Tee-2074273-10'
      },
      {
        'currentPrice': 746,
        'imageUrl': 'http://www.childrensplace.com/wcsstore/GlobalSAS/images/tcp/products/500/2047409_01.jpg',
        'originalPrice': 994,
        'productName': 'Girls Solid Capri Leggings',
        'productUrl': 'http://www.childrensplace.com/shop/us/p/Girls-Solid-Capri-Leggings-2047409-01'
      },
      {
        'currentPrice': 1400,
        'imageUrl': 'http://www.childrensplace.com/wcsstore/GlobalSAS/images/tcp/products/500/2013979_IV.jpg',
        'originalPrice': 1995,
        'productName': 'Girls Uniform Woven Jeggings',
        'productUrl': 'http://www.childrensplace.com/shop/us/p/Girls-Uniform-Woven-Jeggings-2013979-IV'
      },
      {
        'currentPrice': 2997,
        'imageUrl': 'http://www.childrensplace.com/wcsstore/GlobalSAS/images/tcp/products/500/2069818_1001.jpg',
        'originalPrice': 4995,
        'productName': 'Girls Long Sleeve Solid Lightweight Puffer Jacket',
        'productUrl': 'http://www.childrensplace.com/shop/us/p/Girls-Long-Sleeve-Solid-Lightweight-Puffer-Jacket-2069818-1001'
      },
      {
        'currentPrice': 1200,
        'imageUrl': 'http://www.childrensplace.com/wcsstore/GlobalSAS/images/tcp/products/500/2024535_93.jpg',
        'originalPrice': 1950,
        'productName': 'Girls Basic Bootcut Jeans - Medium Worn Stone Wash',
        'productUrl': 'http://www.childrensplace.com/shop/us/p/Girls-Basic-Bootcut-Jeans---Medium-Worn-Stone-Wash-2024535-93'
      }
    ], {pageName, itemPartNumberOrDepartmentId, currentPrice});
  },

  setShipToHome () {
    return editJsonPopup('setShipToHome', {
      success: true
    }, arguments);
  },

  getProductsUserCustomInfo (generalProductIdsList) {
    return editJsonPopup('getProductsUserCustomInfo', {
      [generalProductIdsList[0]]: {
        isInDefaultWishlist: true
      }
    }, generalProductIdsList);
  },

  getProductInfoById (colorProductId) {
    if (colorProductId === 'gift-cards-gc-1') {
      return buildProductInfoGiftCardStaticResponse(colorProductId);
    } else {
      return buildProductInfoProductStaticResponse(colorProductId);
    }
  },

  getOutfitProdutsDetails (outfitId, vendorColorProductIdsList) {
    return editJsonPopup('getOutfitProdutsDetails', {
      // As per our vendor this URL will never change and always contain the images
      outfitImageUrl: `https://s3.amazonaws.com/ampersand.production/collage_images/outfit_collage_image/117510/original.png`,
      products: vendorColorProductIdsList.split('-').map((colorProductId) => buildProductInfoProductStaticResponse(colorProductId, true))
    }, {outfitId, vendorColorProductIdsList});
  },

  getProductColorExtraInfo (colorProductId) {
    return editJsonPopup('getProductColorExtraInfo', {
      listPrice: 1.99,
      offerPrice: 0.99,
      isBopisEligible: true,
      badge1: 'JUST A FEW LEFT!',
      badge2: 'EXTENDED SIZES',
      badge3: '30% OFF'
    }, {colorProductId});
  },

  getExtraImagesForProduct (product) {
    return editJsonPopup('getExtraImagesForProduct', {
      'Red': {
        basicImageUrl: '/wcsstore/static/images/fpo-prod-1.jpg',
        extraImages: [
          {
            iconSizeImageUrl: '/wcsstore/static/images/fpo-prod-1.jpg',
            regularSizeImageUrl: '/wcsstore/static/images/fpo-prod-1.jpg',
            bigSizeImageUrl: '/wcsstore/static/images/fpo-prod-1.jpg',
            superSizeImageUrl: '/wcsstore/static/images/fpo-prod-1.jpg'
          }, {
            iconSizeImageUrl: '/wcsstore/static/images/fpo-prod-2.jpg',
            regularSizeImageUrl: '/wcsstore/static/images/fpo-prod-2.jpg',
            bigSizeImageUrl: '/wcsstore/static/images/fpo-prod-2.jpg',
            superSizeImageUrl: '/wcsstore/static/images/fpo-prod-2.jpg'
          }
        ]
      },
      'Brown': {
        basicImageUrl: '/wcsstore/static/images/fpo-prod-2.jpg',
        extraImages: [
          {
            iconSizeImageUrl: '/wcsstore/static/images/fpo-prod-3.jpg',
            regularSizeImageUrl: '/wcsstore/static/images/fpo-prod-3.jpg',
            bigSizeImageUrl: '/wcsstore/static/images/fpo-prod-3.jpg',
            superSizeImageUrl: '/wcsstore/static/images/fpo-prod-3.jpg'
          }, {
            iconSizeImageUrl: '/wcsstore/static/images/fpo-prod-4.jpg',
            regularSizeImageUrl: '/wcsstore/static/images/fpo-prod-4.jpg',
            bigSizeImageUrl: '/wcsstore/static/images/fpo-prod-4.jpg',
            superSizeImageUrl: '/wcsstore/static/images/fpo-prod-4.jpg'
          }
        ]
      }
    });
  },

  getExtraImagesForProductsList (productsList) {
    return editJsonPopup('getExtraImagesForProductsList', productsList);
  },

  getCategoryListingPage (searchTerm, seoKeywordOrCategoryId, filtersAndSort, pageNumber, extaQueryValues) {
    return editJsonPopup('getCategoryListingPage', {
      currentListingSearchForText: null,
      currentListingId: '00005',
      currentListingSeoKey: 'Boys-Denim',
      currentListingName: 'Boys Denim',
      totalProductsCount: 12,
      isDepartment: false,
      currentListingTitle: 'Product listing title',
      currentListingDescription: '<div class="body-copy"><h1>Boys Denim</h1><p>Give your drama queen some more attitude with this graphic tee!</p></div>',
      loadedProducts: [     // make sure the number of products here matches PRODUCTS_PER_LOAD (the static version) in productListingStoreView
        {
          productInfo: {
            generalProductId: 'g1_46',
            name: 'The Dress From Mars The Dress From Mars The Dress From Mars The Dress From Mars The Dress From Mars The Dress From Mars The Dres',
            pdpUrl: 'productDetails/g1_46',
            shortDescription: 'Give your drama queen some more attitude with this graphic tee!',
            longDescription: 'This cozy boot is a cold-weather must for her closet! <ul><li>Made of 100% cotton jersey.</li><li>"#Whatevs" princess emoji at front;embellished with glitter.</li><li>Pre-washed for an extra-gentle feel and to reduce shrinkage.</li><li>Tagless label.</li><li>Imported.</li></ul>',
            isGiftCard: false,
            listPrice: 10.69,
            offerPrice: 9.99
          },

          miscInfo: {
            rating: 3.5,
            categoryName: 'Dress'
          },

          colorsMap: [
            {
              colorProductId: 'g1_96',
              color: {
                name: 'Brown',
                imagePath: '/wcsstore/static/images/colors/blue-color.png'
              },
              miscInfo: {
                listPrice: 7.6,
                offerPrice: 7.1,
                isBopisEligible: true,
                badge1: 'LALALA ITEM',
                badge2: 'LALALA ITEM 2',
                badge3: '30% OFF'
              }
            },
            {
              colorProductId: 'g1_47',
              color: {
                name: 'Red',
                imagePath: '/wcsstore/static/images/colors/brown-color.png'
              },
              miscInfo: {}
            },
            {
              colorProductId: 'g1_92',
              color: {
                name: 'Brown 1',
                imagePath: '/wcsstore/static/images/colors/cyan-color.png'
              },
              miscInfo: {}
            },
            {
              colorProductId: 'g1_40',
              color: {
                name: 'Red 1',
                imagePath: '/wcsstore/static/images/colors/green-color.png'
              },
              miscInfo: {}
            },
            {
              colorProductId: 'g1_37',
              color: {
                name: 'Brown 2',
                imagePath: '/wcsstore/static/images/colors/grey-color.png'
              },
              miscInfo: {}
            },
            {
              colorProductId: 'f1_46',
              color: {
                name: 'Red 2',
                imagePath: '/wcsstore/static/images/colors/orange-color.png'
              },
              miscInfo: {}
            },
            {
              colorProductId: 'a1_96',
              color: {
                name: 'Brown 3',
                imagePath: '/wcsstore/static/images/colors/red-color.png'
              },
              miscInfo: {}
            },
            {
              colorProductId: 's1_47',
              color: {
                name: 'Red 3',
                imagePath: '/wcsstore/static/images/colors/rose-color.png'
              },
              miscInfo: {}
            },
            {
              colorProductId: 'd1_92',
              color: {
                name: 'Brown 4',
                imagePath: '/wcsstore/static/images/colors/violet-color.png'
              },
              miscInfo: {}
            },
            {
              colorProductId: 'q1_40',
              color: {
                name: 'Red 4',
                imagePath: '/wcsstore/static/images/colors/yellow-color.png'
              },
              miscInfo: {}
            },
            {
              colorProductId: 'w1_37',
              color: {
                name: 'Brown 5',
                imagePath: '/wcsstore/static/images/colors/blue-color.png'
              },
              miscInfo: {}
            },
            {
              colorProductId: 'e1_46',
              color: {
                name: 'Red 5',
                imagePath: '/wcsstore/static/images/colors/blue-color.png'
              },
              miscInfo: {}
            }
          ],

          imagesByColor: {
            'Brown': {
              extraImages: [
                {
                  iconSizeImageUrl: '/wcsstore/static/images/fpo-prod-1.jpg',
                  regularSizeImageUrl: '/wcsstore/static/images/fpo-prod-1.jpg',
                  bigSizeImageUrl: '/wcsstore/static/images/fpo-prod-1.jpg',
                  superSizeImageUrl: '/wcsstore/static/images/fpo-prod-1.jpg'
                },
                {
                  iconSizeImageUrl: '/wcsstore/static/images/fpo-prod-2.jpg',
                  regularSizeImageUrl: '/wcsstore/static/images/fpo-prod-2.jpg',
                  bigSizeImageUrl: '/wcsstore/static/images/fpo-prod-2.jpg',
                  superSizeImageUrl: '/wcsstore/static/images/fpo-prod-2.jpg'
                },
                {
                  iconSizeImageUrl: '/wcsstore/static/images/fpo-prod-3.jpg',
                  regularSizeImageUrl: '/wcsstore/static/images/fpo-prod-3.jpg',
                  bigSizeImageUrl: '/wcsstore/static/images/fpo-prod-3.jpg',
                  superSizeImageUrl: '/wcsstore/static/images/fpo-prod-3.jpg'
                },
                {
                  iconSizeImageUrl: '/wcsstore/static/images/fpo-prod-3.jpg',
                  regularSizeImageUrl: '/wcsstore/static/images/fpo-prod-3.jpg',
                  bigSizeImageUrl: '/wcsstore/static/images/fpo-prod-3.jpg',
                  superSizeImageUrl: '/wcsstore/static/images/fpo-prod-3.jpg'
                }
              ]
            },
            'Red': {
              extraImages: [{
                iconSizeImageUrl: '/wcsstore/static/images/fpo-prod-1.jpg',
                regularSizeImageUrl: '/wcsstore/static/images/fpo-prod-1.jpg',
                bigSizeImageUrl: '/wcsstore/static/images/fpo-prod-1.jpg',
                superSizeImageUrl: '/wcsstore/static/images/fpo-prod-1.jpg'
              }]
            },
            'Brown 1': {
              extraImages: [
                {
                  iconSizeImageUrl: '/wcsstore/static/images/fpo-prod-1.jpg',
                  regularSizeImageUrl: '/wcsstore/static/images/fpo-prod-1.jpg',
                  bigSizeImageUrl: '/wcsstore/static/images/fpo-prod-1.jpg',
                  superSizeImageUrl: '/wcsstore/static/images/fpo-prod-1.jpg'
                },
                {
                  iconSizeImageUrl: '/wcsstore/static/images/fpo-prod-2.jpg',
                  regularSizeImageUrl: '/wcsstore/static/images/fpo-prod-2.jpg',
                  bigSizeImageUrl: '/wcsstore/static/images/fpo-prod-2.jpg',
                  superSizeImageUrl: '/wcsstore/static/images/fpo-prod-2.jpg'
                },
                {
                  iconSizeImageUrl: '/wcsstore/static/images/fpo-prod-3.jpg',
                  regularSizeImageUrl: '/wcsstore/static/images/fpo-prod-3.jpg',
                  bigSizeImageUrl: '/wcsstore/static/images/fpo-prod-3.jpg',
                  superSizeImageUrl: '/wcsstore/static/images/fpo-prod-3.jpg'
                },
                {
                  iconSizeImageUrl: '/wcsstore/static/images/fpo-prod-3.jpg',
                  regularSizeImageUrl: '/wcsstore/static/images/fpo-prod-3.jpg',
                  bigSizeImageUrl: '/wcsstore/static/images/fpo-prod-3.jpg',
                  superSizeImageUrl: '/wcsstore/static/images/fpo-prod-3.jpg'
                }
              ]
            },
            'Red 1': {
              extraImages: [{
                iconSizeImageUrl: '/wcsstore/static/images/fpo-prod-1.jpg',
                regularSizeImageUrl: '/wcsstore/static/images/fpo-prod-1.jpg',
                bigSizeImageUrl: '/wcsstore/static/images/fpo-prod-1.jpg',
                superSizeImageUrl: '/wcsstore/static/images/fpo-prod-1.jpg'
              }]
            },
            'Brown 2': {
              extraImages: [
                {
                  iconSizeImageUrl: '/wcsstore/static/images/fpo-prod-1.jpg',
                  regularSizeImageUrl: '/wcsstore/static/images/fpo-prod-1.jpg',
                  bigSizeImageUrl: '/wcsstore/static/images/fpo-prod-1.jpg',
                  superSizeImageUrl: '/wcsstore/static/images/fpo-prod-1.jpg'
                },
                {
                  iconSizeImageUrl: '/wcsstore/static/images/fpo-prod-2.jpg',
                  regularSizeImageUrl: '/wcsstore/static/images/fpo-prod-2.jpg',
                  bigSizeImageUrl: '/wcsstore/static/images/fpo-prod-2.jpg',
                  superSizeImageUrl: '/wcsstore/static/images/fpo-prod-2.jpg'
                },
                {
                  iconSizeImageUrl: '/wcsstore/static/images/fpo-prod-3.jpg',
                  regularSizeImageUrl: '/wcsstore/static/images/fpo-prod-3.jpg',
                  bigSizeImageUrl: '/wcsstore/static/images/fpo-prod-3.jpg',
                  superSizeImageUrl: '/wcsstore/static/images/fpo-prod-3.jpg'
                },
                {
                  iconSizeImageUrl: '/wcsstore/static/images/fpo-prod-3.jpg',
                  regularSizeImageUrl: '/wcsstore/static/images/fpo-prod-3.jpg',
                  bigSizeImageUrl: '/wcsstore/static/images/fpo-prod-3.jpg',
                  superSizeImageUrl: '/wcsstore/static/images/fpo-prod-3.jpg'
                }
              ]
            },
            'Red 2': {
              extraImages: [{
                iconSizeImageUrl: '/wcsstore/static/images/fpo-prod-1.jpg',
                regularSizeImageUrl: '/wcsstore/static/images/fpo-prod-1.jpg',
                bigSizeImageUrl: '/wcsstore/static/images/fpo-prod-1.jpg',
                superSizeImageUrl: '/wcsstore/static/images/fpo-prod-1.jpg'
              }]
            },
            'Brown 3': {
              extraImages: [
                {
                  iconSizeImageUrl: '/wcsstore/static/images/fpo-prod-1.jpg',
                  regularSizeImageUrl: '/wcsstore/static/images/fpo-prod-1.jpg',
                  bigSizeImageUrl: '/wcsstore/static/images/fpo-prod-1.jpg',
                  superSizeImageUrl: '/wcsstore/static/images/fpo-prod-1.jpg'
                },
                {
                  iconSizeImageUrl: '/wcsstore/static/images/fpo-prod-2.jpg',
                  regularSizeImageUrl: '/wcsstore/static/images/fpo-prod-2.jpg',
                  bigSizeImageUrl: '/wcsstore/static/images/fpo-prod-2.jpg',
                  superSizeImageUrl: '/wcsstore/static/images/fpo-prod-2.jpg'
                },
                {
                  iconSizeImageUrl: '/wcsstore/static/images/fpo-prod-3.jpg',
                  regularSizeImageUrl: '/wcsstore/static/images/fpo-prod-3.jpg',
                  bigSizeImageUrl: '/wcsstore/static/images/fpo-prod-3.jpg',
                  superSizeImageUrl: '/wcsstore/static/images/fpo-prod-3.jpg'
                },
                {
                  iconSizeImageUrl: '/wcsstore/static/images/fpo-prod-3.jpg',
                  regularSizeImageUrl: '/wcsstore/static/images/fpo-prod-3.jpg',
                  bigSizeImageUrl: '/wcsstore/static/images/fpo-prod-3.jpg',
                  superSizeImageUrl: '/wcsstore/static/images/fpo-prod-3.jpg'
                }
              ]
            },
            'Red 3': {
              extraImages: [{
                iconSizeImageUrl: '/wcsstore/static/images/fpo-prod-1.jpg',
                regularSizeImageUrl: '/wcsstore/static/images/fpo-prod-1.jpg',
                bigSizeImageUrl: '/wcsstore/static/images/fpo-prod-1.jpg',
                superSizeImageUrl: '/wcsstore/static/images/fpo-prod-1.jpg'
              }]
            }
          }
        },
        {
          productInfo: {
            generalProductId: '987866701',
            name: 'Quilted Purse',
            pdpUrl: 'productDetails/g1_45',
            shortDescription: 'Give your drama queen some more attitude with this graphic tee!',
            longDescription: 'This cozy boot is a cold-weather must for her closet! <ul><li>Made of 100% cotton jersey.</li><li>"#Whatevs" princess emoji at front;embellished with glitter.</li><li>Pre-washed for an extra-gentle feel and to reduce shrinkage.</li><li>Tagless label.</li><li>Imported.</li></ul>',
            isGiftCard: false,
            listPrice: 110.69,
            offerPrice: 110.69
          },

          miscInfo: {
            rating: 1,
            categoryName: 'Dress'
          },

          colorsMap: [
            {
              colorProductId: '987866701',
              color: {
                name: 'Brown',
                imagePath: 'https://uatlive1.childrensplace.com/wcsstore/GlobalSAS/images/tcp/products/swatches/1101084_NN.jpg'
              },
              miscInfo: {}
            },
            {
              colorProductId: 'g1_46',
              color: {
                name: 'Red',
                imagePath: 'https://uatlive1.childrensplace.com/wcsstore/GlobalSAS/images/tcp/products/swatches/1101084_FX.jpg'
              },
              miscInfo: {}
            }
          ],

          imagesByColor: {
            'Brown': {
              extraImages: [
                {
                  iconSizeImageUrl: '/wcsstore/static/images/fpo-prod-1.jpg',
                  regularSizeImageUrl: '/wcsstore/static/images/fpo-prod-1.jpg',
                  bigSizeImageUrl: '/wcsstore/static/images/fpo-prod-1.jpg',
                  superSizeImageUrl: '/wcsstore/static/images/fpo-prod-1.jpg'
                },
                {
                  iconSizeImageUrl: '/wcsstore/static/images/fpo-prod-2.jpg',
                  regularSizeImageUrl: '/wcsstore/static/images/fpo-prod-2.jpg',
                  bigSizeImageUrl: '/wcsstore/static/images/fpo-prod-2.jpg',
                  superSizeImageUrl: '/wcsstore/static/images/fpo-prod-2.jpg'
                },
                {
                  iconSizeImageUrl: '/wcsstore/static/images/fpo-prod-3.jpg',
                  regularSizeImageUrl: '/wcsstore/static/images/fpo-prod-3.jpg',
                  bigSizeImageUrl: '/wcsstore/static/images/fpo-prod-3.jpg',
                  superSizeImageUrl: '/wcsstore/static/images/fpo-prod-3.jpg'
                },
                {
                  iconSizeImageUrl: '/wcsstore/static/images/fpo-prod-3.jpg',
                  regularSizeImageUrl: '/wcsstore/static/images/fpo-prod-3.jpg',
                  bigSizeImageUrl: '/wcsstore/static/images/fpo-prod-3.jpg',
                  superSizeImageUrl: '/wcsstore/static/images/fpo-prod-3.jpg'
                }
              ]
            },
            'Red': {
              extraImages: [{
                iconSizeImageUrl: '/wcsstore/static/images/fpo-prod-1.jpg',
                regularSizeImageUrl: '/wcsstore/static/images/fpo-prod-1.jpg',
                bigSizeImageUrl: '/wcsstore/static/images/fpo-prod-1.jpg',
                superSizeImageUrl: '/wcsstore/static/images/fpo-prod-1.jpg'
              }]
            }
          }
        },
        {
          productInfo: {
            generalProductId: '213123',
            name: 'Quilted Purse',
            pdpUrl: 'productDetails/g1_45',
            shortDescription: 'Give your drama queen some more attitude with this graphic tee!',
            longDescription: 'This cozy boot is a cold-weather must for her closet! <ul><li>Made of 100% cotton jersey.</li><li>"#Whatevs" princess emoji at front;embellished with glitter.</li><li>Pre-washed for an extra-gentle feel and to reduce shrinkage.</li><li>Tagless label.</li><li>Imported.</li></ul>',
            isGiftCard: false,
            listPrice: 20.69,
            offerPrice: 19.99
          },

          miscInfo: {
            rating: 4,
            categoryName: 'Pants'
          },

          colorsMap: [
            {
              colorProductId: '213123',
              color: {
                name: 'Brown',
                imagePath: 'https://uatlive1.childrensplace.com/wcsstore/GlobalSAS/images/tcp/products/swatches/1101084_NN.jpg'
              },
              miscInfo: {}
            },
            {
              colorProductId: 'g1_46',
              color: {
                name: 'Red',
                imagePath: 'https://uatlive1.childrensplace.com/wcsstore/GlobalSAS/images/tcp/products/swatches/1101084_FX.jpg'
              },
              miscInfo: {}
            }
          ],

          imagesByColor: {
            'Brown': {
              basicImageUrl: '/wcsstore/static/images/fpo-prod-1.jpg',
              extraImages: [
                {
                  iconSizeImageUrl: '/wcsstore/static/images/fpo-prod-2.jpg',
                  regularSizeImageUrl: '/wcsstore/static/images/fpo-prod-2.jpg',
                  bigSizeImageUrl: '/wcsstore/static/images/fpo-prod-2.jpg',
                  superSizeImageUrl: '/wcsstore/static/images/fpo-prod-2.jpg'
                },
                {
                  iconSizeImageUrl: '/wcsstore/static/images/fpo-prod-3.jpg',
                  regularSizeImageUrl: '/wcsstore/static/images/fpo-prod-3.jpg',
                  bigSizeImageUrl: '/wcsstore/static/images/fpo-prod-3.jpg',
                  superSizeImageUrl: '/wcsstore/static/images/fpo-prod-3.jpg'
                },
                {
                  iconSizeImageUrl: '/wcsstore/static/images/fpo-prod-3.jpg',
                  regularSizeImageUrl: '/wcsstore/static/images/fpo-prod-3.jpg',
                  bigSizeImageUrl: '/wcsstore/static/images/fpo-prod-3.jpg',
                  superSizeImageUrl: '/wcsstore/static/images/fpo-prod-3.jpg'
                }
              ]
            },
            'Red': {
              basicImageUrl: '/wcsstore/static/images/fpo-prod-1.jpg',
              extraImages: []
            }
          }
        },
        {
          productInfo: {
            generalProductId: '3135465',
            name: 'Cool Man\'s Purse',
            pdpUrl: 'productDetails/g1_45',
            shortDescription: 'Give your drama queen some more attitude with this graphic tee!',
            longDescription: 'This cozy boot is a cold-weather must for her closet! <ul><li>Made of 100% cotton jersey.</li><li>"#Whatevs" princess emoji at front;embellished with glitter.</li><li>Pre-washed for an extra-gentle feel and to reduce shrinkage.</li><li>Tagless label.</li><li>Imported.</li></ul>',
            isGiftCard: false,
            listPrice: 11.23,
            offerPrice: 10.99
          },

          miscInfo: {
            rating: 3,
            categoryName: 'Pants'
          },

          colorsMap: [
            {
              colorProductId: 'gc_1',
              color: {
                name: 'Brown',
                imagePath: 'https://uatlive1.childrensplace.com/wcsstore/GlobalSAS/images/tcp/products/swatches/1101084_NN.jpg'
              },
              miscInfo: {}
            },
            {
              colorProductId: '3135465',
              color: {
                name: 'Red',
                imagePath: 'https://uatlive1.childrensplace.com/wcsstore/GlobalSAS/images/tcp/products/swatches/1101084_FX.jpg'
              },
              miscInfo: {}
            }
          ],

          imagesByColor: {
            'Brown': {
              basicImageUrl: '/wcsstore/static/images/fpo-prod-1.jpg',
              extraImages: [
                {
                  iconSizeImageUrl: '/wcsstore/static/images/fpo-prod-2.jpg',
                  regularSizeImageUrl: '/wcsstore/static/images/fpo-prod-2.jpg',
                  bigSizeImageUrl: '/wcsstore/static/images/fpo-prod-2.jpg',
                  superSizeImageUrl: '/wcsstore/static/images/fpo-prod-2.jpg'
                },
                {
                  iconSizeImageUrl: '/wcsstore/static/images/fpo-prod-3.jpg',
                  regularSizeImageUrl: '/wcsstore/static/images/fpo-prod-3.jpg',
                  bigSizeImageUrl: '/wcsstore/static/images/fpo-prod-3.jpg',
                  superSizeImageUrl: '/wcsstore/static/images/fpo-prod-3.jpg'
                },
                {
                  iconSizeImageUrl: '/wcsstore/static/images/fpo-prod-3.jpg',
                  regularSizeImageUrl: '/wcsstore/static/images/fpo-prod-3.jpg',
                  bigSizeImageUrl: '/wcsstore/static/images/fpo-prod-3.jpg',
                  superSizeImageUrl: '/wcsstore/static/images/fpo-prod-3.jpg'
                }
              ]
            },
            'Red': {
              basicImageUrl: '/wcsstore/static/images/fpo-prod-1.jpg',
              extraImages: []
            }
          }
        }
      ],          // make sure the number of products in the array above matches PRODUCTS_PER_LOAD (the static version) in productListingStoreView

      filtersMaps: {
        colors: [
          { id: 'Red', displayName: 'Red', imagePath: '/images/colors/brown-color.png' },
          { id: 'Green', displayName: 'Green', imagePath: '/images/colors/red-color.png' },
          { id: 'Yellow', displayName: 'Yellow', imagePath: '/images/colors/brown-color.png' },
          { id: 'Pink', displayName: 'Pink', imagePath: '/images/colors/red-color.png' }
        ],

        sizes: [
          {id: '21', displayName: 'XL/XXL1216'},
          {id: '22', displayName: 'XL/XXL1216'},
          {id: '23', displayName: 'TODDLER8-9'},
          {id: '24', displayName: 'YOUTH12-13'},
          {id: '25', displayName: 'TODDLER 13'},
          {id: '26', displayName: 'L/XL(8+YR)'},
          {id: '27', displayName: 'ONE SIZE'},
          {id: '28', displayName: 'XS/S(6-24M)'},
          {id: '29', displayName: 'S/M(24M-3T)'}
        ],

        departments: [
          {displayName: 'Girl', id: '47511'},
          {displayName: 'Toddler Girl', id: '47502'},
          {displayName: 'Boy', id: '47503'},
          {displayName: 'Toddler Boy', id: '47501'},
          {displayName: 'Baby', id: '47504'}
        ],

        subDepartments: [
          {displayName: 'Tops', id: '55511'},
          {displayName: 'Bottoms', id: '55502'},
          {displayName: 'Sleepware', id: '55503'}
        ]
      },
      appliedFiltersIds: {
        colors: filtersAndSort.colorFilterIdsList,
        sizes: filtersAndSort.sizeFiltersIdsList,
        departments: filtersAndSort.departmentFiltersIdsList,
        subDepartments: filtersAndSort.subDepartmentFiltersIdsList
      },
      appliedSortId: filtersAndSort.sortId,
      navitagionTree: [
        {
          categoryId: '00001',
          name: 'Tops',
          plpPath: '/us/c/Girl-Tops',
          children: []
        },
        {
          categoryId: '00002',
          name: 'Bottoms',
          plpPath: '/us/c/Girl-Bottoms',
          children: []
        },
        {
          categoryId: '00003',
          name: 'Shoes',
          plpPath: '/us/c/Girl-Sheos',
          children: []
        },
        {
          categoryId: '00004',
          name: 'Shirts',
          plpPath: '/us/c/Girl-Shirts',
          children: []
        },
        {
          categoryId: '00005',
          name: 'Accesories',
          plpPath: 'Girl-Accesories',
          children: [{
            categoryId: '00014',
            name: 'Bags',
            plpPath: '/us/c/Girl-Accesories-Bags'
          },
          {
            categoryId: '00024',
            name: 'Glasses',
            plpPath: '/us/c/Girl-Glasses'
          }]
        }
      ],

      breadCrumbTrail: [
        {
          displayName: 'Girl',
          urlPathSuffix: 'Girls'
        }, {
          displayName: 'Accesories',
          urlPathSuffix: 'Girl-Accesories'
        }]
    }, {searchTerm, seoKeywordOrCategoryId, filtersAndSort, pageNumber, extaQueryValues})
    .then((result) =>     // append pageNumber to generalProduictId of all loaded products
      ({
        ...result,
        loadedProducts: result.loadedProducts.map((product) => ({
          ...product,
          productInfo: {...product.productInfo, generalProductId: product.productInfo.generalProductId + (pageNumber > 1 ? pageNumber : '')}
        }))
      })
    );
  },

  addItemToCart (skuId, quantity, wishlistId) {
    return editJsonPopup('addItemToCart', { orderItemId: '802374863' }, {skuId, quantity, wishlistId});
  }

};

function buildProductInfoProductStaticResponse (colorProductId, isOutfitPart) {
  let colorFitsSizesMap = [
    {
      color: {
        name: 'Red',
        imagePath: '/wcsstore/static/images/colors/red-color.png'
      },
      colorProductId: colorProductId,
      colorDisplayId: '8974328_0A', // We need this to display on PDP as well as to send to api for recommendations
      favoritedCount: -1,
      maxAvailable: Number.MAX_VALUE,
      hasFits: true,
      listPrice: 10.69,
      offerPrice: 9.99,
      miscInfo: {
        badge1: 'GLOW-IN-THE-DARK'
      },
      fits: [
        {
          fitName: 'husky',
          maxAvailable: Number.MAX_VALUE,
          sizes: [
            {
              sizeName: 'H XL',
              skuId: '1',
              listPrice: 11.69,
              offerPrice: 9.69,
              maxAvailable: Number.MAX_VALUE
            },
            {
              sizeName: 'H XXL',
              skuId: '2',
              listPrice: 12.69,
              offerPrice: 11.69,
              maxAvailable: Number.MAX_VALUE
            },
            {
              sizeName: 'H XXXL',
              skuId: '3',
              listPrice: 10.69,
              offerPrice: 10.69,
              maxAvailable: Number.MAX_VALUE
            }
          ]
        },
        {
          fitName: 'Slim',
          maxAvailable: Number.MAX_VALUE,
          sizes: [
            {
              sizeName: 'S XL',
              skuId: '4',
              listPrice: 10.69,
              offerPrice: 10.69,
              maxAvailable: Number.MAX_VALUE
            },
            {
              sizeName: 'S XXL',
              skuId: '5',
              listPrice: 10.69,
              offerPrice: 10.69,
              maxAvailable: Number.MAX_VALUE
            },
            {
              sizeName: 'S XXXL',
              skuId: '6',
              listPrice: 10.69,
              offerPrice: 10.69,
              maxAvailable: Number.MAX_VALUE
            }
          ]
        }
      ]
    },
    {
      color: {
        name: 'Brown',
        imagePath: '/wcsstore/static/images/colors/brown-color.png'
      },
      colorProductId: 'g1_96',
      colorDisplayId: '8974328_0B', // We need this to display on PDP as well as to send to api for recommendations
      favoritedCount: -1,
      maxAvailable: Number.MAX_VALUE,
      hasFits: false,
      miscInfo: {
        badge1: 'JUST A FEW LEFT!',
        listPrice: 7.69,
        offerPrice: 5.49,
        isBopisEligible: true
      },
      fits: [
        {
          maxAvailable: Number.MAX_VALUE,
          sizes: [
            {
              sizeName: 'XL',
              skuId: '7',
              listPrice: 10.69,
              offerPrice: 10.69,
              maxAvailable: Number.MAX_VALUE
            },
            {
              sizeName: 'XXL',
              skuId: '8',
              listPrice: 10.69,
              offerPrice: 10.69,
              maxAvailable: Number.MAX_VALUE
            },
            {
              sizeName: 'XXXL',
              skuId: '9',
              listPrice: 10.69,
              offerPrice: 10.69,
              maxAvailable: Number.MAX_VALUE
            }
          ]
        }
      ]
    }
  ];

  let product = {
    'generalProductId': colorProductId,

    ratingsProductId: '1101084',

    'name': 'Quilted Purse',

    'imagesByColor': {
      'Red': {
        basicImageUrl: '/wcsstore/static/images/fpo-prod-1.jpg',
        extraImages: isOutfitPart ? [] : [
          {
            iconSizeImageUrl: '/wcsstore/static/images/fpo-prod-1.jpg',
            regularSizeImageUrl: '/wcsstore/static/images/fpo-prod-1.jpg',
            bigSizeImageUrl: '/wcsstore/static/images/fpo-prod-1.jpg',
            superSizeImageUrl: '/wcsstore/static/images/fpo-prod-1.jpg'
          }, {
            iconSizeImageUrl: '/wcsstore/static/images/fpo-prod-2.jpg',
            regularSizeImageUrl: '/wcsstore/static/images/fpo-prod-2.jpg',
            bigSizeImageUrl: '/wcsstore/static/images/fpo-prod-2.jpg',
            superSizeImageUrl: '/wcsstore/static/images/fpo-prod-2.jpg'
          }
        ]
      },
      'Brown': {
        basicImageUrl: '/wcsstore/static/images/fpo-prod-2.jpg',
        extraImages: isOutfitPart ? [] : [
          {
            iconSizeImageUrl: '/wcsstore/static/images/fpo-prod-3.jpg',
            regularSizeImageUrl: '/wcsstore/static/images/fpo-prod-3.jpg',
            bigSizeImageUrl: '/wcsstore/static/images/fpo-prod-3.jpg',
            superSizeImageUrl: '/wcsstore/static/images/fpo-prod-3.jpg'
          }, {
            iconSizeImageUrl: '/wcsstore/static/images/fpo-prod-4.jpg',
            regularSizeImageUrl: '/wcsstore/static/images/fpo-prod-4.jpg',
            bigSizeImageUrl: '/wcsstore/static/images/fpo-prod-4.jpg',
            superSizeImageUrl: '/wcsstore/static/images/fpo-prod-4.jpg'
          }
        ]
      }
    },

    'colorFitsSizesMap': colorFitsSizesMap,

    'pdpUrl': `productDetails/${colorProductId}`,

    'shortDescription': 'Give your drama queen some more attitude with this graphic tee!',

    'longDescription': 'This cozy boot is a cold-weather must for her closet! <ul><li>Made of 100% cotton jersey.</li><li>"#Whatevs" princess emoji at front;embellished with glitter.</li><li>Pre-washed for an extra-gentle feel and to reduce shrinkage.</li><li>Tagless label.</li><li>Imported.</li></ul>',

    'isGiftCard': false,

    listPrice: 10.69,

    offerPrice: 9.99
  };

  let breadCrumbTrail = [
    {displayName: 'Boys', urlPathSuffix: isOutfitPart ? `12${colorProductId}` : '56464454'},
    {displayName: 'Bottoms', urlPathSuffix: isOutfitPart ? `34${colorProductId}` : '56464454'}
  ];

  return isOutfitPart
    ? product
    : editJsonPopup('getProductInfoById', {
      product: product,
      breadCrumbTrail: breadCrumbTrail
    }, colorProductId);
}

function buildProductInfoGiftCardStaticResponse (colorProductId) {
  let colorFitsSizesMap = [
    {
      color: {
        name: 'Skiing Scout',
        imagePath: '/wcsstore/static/images/gc/giftcard_1.jpg'
      },
      colorProductId: 'gc_1',
      favoritedCount: -1,
      maxAvailable: Number.MAX_VALUE,
      hasFits: false,
      miscInfo: {},
      fits: [
        {
          maxAvailable: Number.MAX_VALUE,
          sizes: [
            {
              sizeName: '$25',
              skuId: '1',
              listPrice: 25,
              maxAvailable: Number.MAX_VALUE
            },
            {
              sizeName: '$50',
              skuId: '2',
              listPrice: 50,
              maxAvailable: Number.MAX_VALUE
            },
            {
              sizeName: '$75',
              skuId: '3',
              listPrice: 75,
              maxAvailable: Number.MAX_VALUE
            },
            {
              sizeName: '$100',
              skuId: '4',
              listPrice: 100,
              maxAvailable: Number.MAX_VALUE
            }
          ]
        }
      ]
    },
    {
      color: {
        name: 'Gift Card 2',
        imagePath: '/wcsstore/static/images/gc/giftcard_2.jpg'
      },
      colorProductId: 'gc_2',
      favoritedCount: -1,
      maxAvailable: Number.MAX_VALUE,
      hasFits: false,
      miscInfo: {},
      fits: [
        {
          maxAvailable: Number.MAX_VALUE,
          sizes: [
            {
              sizeName: '$25',
              skuId: '1',
              listPrice: 25,
              maxAvailable: Number.MAX_VALUE
            },
            {
              sizeName: '$50',
              skuId: '2',
              listPrice: 50,
              maxAvailable: Number.MAX_VALUE
            },
            {
              sizeName: '$75',
              skuId: '3',
              listPrice: 75,
              maxAvailable: Number.MAX_VALUE
            },
            {
              sizeName: '$100',
              skuId: '4',
              listPrice: 100,
              maxAvailable: Number.MAX_VALUE
            }
          ]
        }
      ]
    }
  ];

  let product = {
    'generalProductId': 'gc_1',

    'name': 'Gift Card',

    'imagesByColor': {
      'Skiing Scout': {
        color: {
          'name': 'Skiing Scout',
          'imagePath': '/wcsstore/static/images/gc/giftcard_1.jpg'
        },
        basicImageUrl: '/wcsstore/static/images/gc/giftcard_1.jpg',
        extraImages: [
          {
            iconSizeImageUrl: '/wcsstore/static/images/gc/giftcard_1.jpg',
            regularSizeImageUrl: '/wcsstore/static/images/gc/giftcard_1.jpg',
            bigSizeImageUrl: '/wcsstore/static/images/gc/giftcard_1.jpg',
            superSizeImageUrl: '/wcsstore/static/images/gc/giftcard_1.jpg'
          }
        ]
      },
      'Gift Card 2': {
        color: {
          'name': 'Gift Card 2',
          'imagePath': '/wcsstore/static/images/gc/giftcard_2.jpg'
        },
        basicImageUrl: '/wcsstore/static/images/gc/giftcard_2.jpg',
        extraImages: [
          {
            iconSizeImageUrl: '/wcsstore/static/images/gc/giftcard_2.jpg',
            regularSizeImageUrl: '/wcsstore/static/images/gc/giftcard_2.jpg',
            bigSizeImageUrl: '/wcsstore/static/images/gc/giftcard_2.jpg',
            superSizeImageUrl: '/wcsstore/static/images/gc/giftcard_2.jpg'
          }
        ]
      }
    },

    colorFitsSizesMap: colorFitsSizesMap,

    pdpUrl: 'productDetails/gc_1',

    isGiftCard: true,

    colorFitSizeDisplayNames: {color: 'Design', size: 'Value (USD)'},

    listPrice: 0
  };

  return editJsonPopup('getProductInfoById', {
    product: product,
    breadCrumbTrail: []
  }, colorProductId);
}
