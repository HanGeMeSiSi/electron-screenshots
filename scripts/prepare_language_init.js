const fs = require('fs');

function getCountryNameByCode(code) {
  const codeName = {
    AF: 'Afghanistan',
    AR: 'Argentina',
    AZ: 'Azerbaijan',
    BG: 'Bulgaria',
    BN: 'Brunei',
    BS: 'Bahamas',
    CA: 'Canada',
    CS: 'Costa Rica',
    CY: 'Cyprus',
    DA: 'Denmark',
    DE: 'Germany',
    EN: 'English',
    ES: 'Spain',
    ET: 'Ethiopia',
    EU: 'European Union',
    FI: 'Finlandia',
    FR: 'France',
    GD: 'Grenada',
    GL: 'Greenland',
    GU: 'Guam',
    HR: 'Croatia',
    HU: 'Hungary',
    ID: 'Indonesia',
    IS: 'Iceland',
    IT: 'Italy',
    IV: 'Ivory Coast',
    MK: 'North Macedonia',
    ML: 'Mali',
    MR: 'Mauritania',
    MS: 'Montserrat',
    MY: 'Malaysia',
    NL: 'Netherlands',
    NO: 'Norway',
    PA: 'Panama',
    PL: 'Poland',
    PS: 'State of Palestine',
    PT_BR: 'Brazil',
    PT_PT: 'Portugal',
    RO: 'Romania',
    RU: 'Russia',
    SK: 'Slovakia',
    SL: 'Sierra Leone',
    SR: 'Suriname',
    SV: 'El Salvador',
    SW: 'Sweden',
    TH: 'Thailand',
    TR: 'Turkey',
    UG: 'Uganda',
    UK: 'United Kingdom',
    UR: 'Soviet Union',
    VI: 'United States Virgin Islands',
    ZH_CN: '简体中文',
    ZH_TC: '繁體中文',
  };
  return codeName[code];
}

fs.readdir('./_locales', (err, data) => {
  if (err) throw Error(err);
  const arr = [];
  data.forEach(item => {
    const name = getCountryNameByCode(item.toUpperCase());
    if (name) {
      arr.push({
        name,
        code: item,
      });
    }
  });
  fs.writeFile('./js/languageList.json', JSON.stringify(arr), error => {
    if (error) {
      throw Error('写入文件失败');
    } else {
      console.log('写入文件成功');
    }
  });
});
