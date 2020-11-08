exports.memberData = [
  {
    memberCode: "MO01",
    memberOrg: "Member Org 01",
  },
  {
    memberCode: "MO02",
    memberOrg: "Member Org 02",
  },
  {
    memberCode: "MO03",
    memberOrg: "Member Org 03",
  },
  {
    memberCode: "MO04",
    memberOrg: "Member Org 04",
  },
  {
    memberCode: "MO05",
    memberOrg: "Member Org 05",
  },
  {
    memberCode: "MO06",
    memberOrg: "Member Org 06",
  },
  {
    memberCode: "MO07",
    memberOrg: "Member Org 07",
  },
  {
    memberCode: "MO08",
    memberOrg: "Member Org 08",
  },
  {
    memberCode: "MO09",
    memberOrg: "Member Org 09",
  },
];

exports.holdingData = [
  {
    holdingCode: "HO01",
    holdingOrg: "Org 01",
  },
  {
    holdingCode: "HO02",
    holdingOrg: "Org 02",
  },
  {
    holdingCode: "HO03",
    holdingOrg: "Org 03",
  },
  {
    holdingCode: "HO04",
    holdingOrg: "Org 04",
  },
  {
    holdingCode: "HO05",
    holdingOrg: "Org 05",
  },
  {
    holdingCode: "HO06",
    holdingOrg: "Org 06",
  },
  {
    holdingCode: "HO07",
    holdingOrg: "Org 07",
  },
  {
    holdingCode: "HO08",
    holdingOrg: "Org 08",
  },
  {
    holdingCode: "HO09",
    holdingOrg: "Org 09",
  },
];

const roleCategory = Object.freeze({
  USER_ROLES: "USER_ROLES",
  MKTG_ROLES: "MKTG_ROLES",
  DATA_ENTRY: "DATA_ENTRY",
});

exports.roleData = [
  {
    roleCode: "RA01",
    roleName: "User Admin",
    roleCategory: roleCategory.USER_ROLES,
  },
  {
    roleCode: "RA02",
    roleName: "Marketing and Promotions Manager",
    roleCategory: roleCategory.MKTG_ROLES,
  },
  {
    roleCode: "RA03",
    roleName: "Product Catalog Manager",
    roleCategory: roleCategory.DATA_ENTRY,
  },
];

exports.userData = [
  {
    username: "jyotiee",
    name: "Jasper P",
    email: "jp@retail.biz.in",
    password: "test@123",
    isAdmin: true,
  },
  {
    username: "frank",
    name: "Frank",
    email: "frank@retail.biz.in",
    password: "test@123",
    isAdmin: true,
  },
  {
    username: "garyd",
    name: "Gaurav",
    email: "gary@retail.biz.in",
    password: "test@123",
  },
];
