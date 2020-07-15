import ChinaLocationData from './ChinaLocation'

const provinceMap = new Map() // 省
const provinceCodeWithCityMap = new Map() // 省份code映射省份名称
const cityCodeWithRegionMap = new Map() // 城市code映射地区名称

// 返回省份映射对象
const getProvinceMap = () => {
  if (provinceMap.size !== 0) {
    return provinceMap
  }
  ChinaLocationData.forEach(item => {
    // provinceCodeWithCityMap.set(item.code, item.city)
    // provinceMap.set(item.code, item.name)
    provinceCodeWithCityMap.set(item.name, item.city)
    provinceMap.set(item.code, item.name)
  })
  return provinceMap
}

const getCityMap = (provinceCode) => {
  const cityMap = new Map()
  if (provinceCodeWithCityMap.size === 0) {
    getProvinceMap()
  }
  console.log(provinceCodeWithCityMap)
  provinceCodeWithCityMap.get(provinceCode).forEach(item => {
    cityMap.set(item.code, item.name)
    // cityCodeWithRegionMap.set(item.code, item.region)
    cityCodeWithRegionMap.set(item.name, item.region)
  })
  return cityMap
}

const getRegionMap = cityCode => {
  const regionMap = new Map()
  if (cityCodeWithRegionMap.size === 0) {
    getCityMap()
  }
  if (cityCodeWithRegionMap.get(cityCode)) {
    cityCodeWithRegionMap.get(cityCode).forEach(item => {
      regionMap.set(item.code, item.name)
    })
  }
  return regionMap
}

export {
  getProvinceMap,
  getCityMap,
  getRegionMap
}
