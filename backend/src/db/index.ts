import { Sequelize } from 'sequelize';
import databaseConfig from '../config/database.js';
import {
  initCountry,
  initState,
  initCity,
  initPostalCode,
  initOrganization,
  initUser,
  initRole,
  initPermission,
  initRolePermission,
  initUserOrganization,
  initSession,
  initPasswordResetToken,
  initPasswordResetOtp,
  initEmailVerificationToken,
  initPasswordHistory,
  initLoginHistory,
  initAccountDeletionRequest,
  initBrand,
  initCategory,
  initUnitOfMeasure,
  initTaxRate,
  initProduct,
  initProductImage,
  initProductVariant,
  initProductBundle,
  Country,
  State,
  City,
  PostalCode,
  Organization,
  User,
  Role,
  Permission,
  RolePermission,
  UserOrganization,
  Session,
  PasswordResetToken,
  PasswordResetOtp,
  EmailVerificationToken,
  PasswordHistory,
  LoginHistory,
  AccountDeletionRequest,
  Brand,
  Category,
  UnitOfMeasure,
  TaxRate,
  Product,
  ProductImage,
  ProductVariant,
  ProductBundle,
  initWarehouse,
  initStockLocation,
  initBatch,
  initSerialNumber,
  initStock,
  initStockReservation,
  initInventoryTransaction,
  initStockAdjustment,
  initStockTransfer,
  initStockTransferItem,
  Warehouse,
  StockLocation,
  Batch,
  SerialNumber,
  Stock,
  StockReservation,
  InventoryTransaction,
  StockAdjustment,
  StockTransfer,
  StockTransferItem,
  initCustomerGroup,
  initCustomer,
  initCustomerPricing,
  initSupplier,
  initSupplierProduct,
  initSalesChannel,
  initSalesOrder,
  initSalesOrderItem,
  initSalesReturn,
  initSalesReturnItem,
  initPurchaseOrder,
  initPurchaseOrderItem,
  initGoodsReceiptNote,
  initGoodsReceiptNoteItem,
  initPurchaseReturn,
  initPurchaseReturnItem,
  initInvoice,
  initInvoiceItem,
  initPayment,
  initPaymentAllocation,
  initShippingCarrier,
  initShipment,
  initDeliveryNote,
  initPricingRule,
  initTaxExemption,
  initFile,
  initSavedReport,
  initReportSchedule,
  initDashboardWidget,
  initNotificationPreference,
  initNotification,
  initAuditLog,
  initSubscriptionPlan,
  initSubscription,
  initUsageTracking,
  initApiKey,
  initWebhook,
  initWebhookLog,
} from '../models/index.js';

const sequelize = new Sequelize({
  host: databaseConfig.host,
  port: databaseConfig.port,
  username: databaseConfig.username,
  password: databaseConfig.password,
  database: databaseConfig.database,
  dialect: databaseConfig.dialect,
  logging: databaseConfig.logging,
  pool: databaseConfig.pool,
  define: databaseConfig.define,
});

// Init models in dependency order (FK order)
initCountry(sequelize);
initState(sequelize);
initCity(sequelize);
initPostalCode(sequelize);
initOrganization(sequelize);
initUser(sequelize);
initRole(sequelize);
initPermission(sequelize);
initRolePermission(sequelize);
initUserOrganization(sequelize);
initSession(sequelize);
initPasswordResetToken(sequelize);
initPasswordResetOtp(sequelize);
initEmailVerificationToken(sequelize);
initPasswordHistory(sequelize);
initLoginHistory(sequelize);
initAccountDeletionRequest(sequelize);
initBrand(sequelize);
initCategory(sequelize);
initUnitOfMeasure(sequelize);
initTaxRate(sequelize);
initProduct(sequelize);
initProductImage(sequelize);
initProductVariant(sequelize);
initProductBundle(sequelize);
initWarehouse(sequelize);
initStockLocation(sequelize);
initBatch(sequelize);
initSerialNumber(sequelize);
initStock(sequelize);
initStockReservation(sequelize);
initInventoryTransaction(sequelize);
initStockAdjustment(sequelize);
initStockTransfer(sequelize);
initStockTransferItem(sequelize);
initCustomerGroup(sequelize);
initCustomer(sequelize);
initCustomerPricing(sequelize);
initSupplier(sequelize);
initSupplierProduct(sequelize);
initSalesChannel(sequelize);
initSalesOrder(sequelize);
initSalesOrderItem(sequelize);
initSalesReturn(sequelize);
initSalesReturnItem(sequelize);
initPurchaseOrder(sequelize);
initPurchaseOrderItem(sequelize);
initGoodsReceiptNote(sequelize);
initGoodsReceiptNoteItem(sequelize);
initPurchaseReturn(sequelize);
initPurchaseReturnItem(sequelize);
initInvoice(sequelize);
initInvoiceItem(sequelize);
initPayment(sequelize);
initPaymentAllocation(sequelize);
initShippingCarrier(sequelize);
initShipment(sequelize);
initDeliveryNote(sequelize);
initPricingRule(sequelize);
initTaxExemption(sequelize);
initFile(sequelize);
initSavedReport(sequelize);
initReportSchedule(sequelize);
initDashboardWidget(sequelize);
initNotificationPreference(sequelize);
initNotification(sequelize);
initAuditLog(sequelize);
initSubscriptionPlan(sequelize);
initSubscription(sequelize);
initUsageTracking(sequelize);
initApiKey(sequelize);
initWebhook(sequelize);
initWebhookLog(sequelize);

// Associations: core reference
Country.hasMany(State, { foreignKey: 'countryId' });
State.belongsTo(Country, { foreignKey: 'countryId' });
State.hasMany(City, { foreignKey: 'stateId' });
City.belongsTo(State, { foreignKey: 'stateId' });
City.hasMany(PostalCode, { foreignKey: 'cityId' });
PostalCode.belongsTo(City, { foreignKey: 'cityId' });

// Organizations
Organization.belongsTo(City, { foreignKey: 'cityId' });
City.hasMany(Organization, { foreignKey: 'cityId' });

// Roles & permissions
Organization.hasMany(Role, { foreignKey: 'organizationId' });
Role.belongsTo(Organization, { foreignKey: 'organizationId' });
Role.belongsToMany(Permission, { through: RolePermission, foreignKey: 'roleId', otherKey: 'permissionId' });
Permission.belongsToMany(Role, { through: RolePermission, foreignKey: 'permissionId', otherKey: 'roleId' });
RolePermission.belongsTo(Role, { foreignKey: 'roleId' });
RolePermission.belongsTo(Permission, { foreignKey: 'permissionId' });

// User-organization junction
User.belongsToMany(Organization, { through: UserOrganization, foreignKey: 'userId', otherKey: 'organizationId' });
Organization.belongsToMany(User, { through: UserOrganization, foreignKey: 'organizationId', otherKey: 'userId' });
UserOrganization.belongsTo(User, { foreignKey: 'userId' });
UserOrganization.belongsTo(Organization, { foreignKey: 'organizationId' });
UserOrganization.belongsTo(Role, { foreignKey: 'roleId' });
Role.hasMany(UserOrganization, { foreignKey: 'roleId' });
UserOrganization.belongsTo(User, { as: 'inviter', foreignKey: 'invitedBy' });

// Auth
User.hasMany(Session, { foreignKey: 'userId' });
Session.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(PasswordResetToken, { foreignKey: 'userId' });
PasswordResetToken.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(PasswordResetOtp, { foreignKey: 'userId' });
PasswordResetOtp.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(EmailVerificationToken, { foreignKey: 'userId' });
EmailVerificationToken.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(PasswordHistory, { foreignKey: 'userId' });
PasswordHistory.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(LoginHistory, { foreignKey: 'userId' });
LoginHistory.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(AccountDeletionRequest, { foreignKey: 'userId' });
AccountDeletionRequest.belongsTo(User, { foreignKey: 'userId' });

// Catalog
Organization.hasMany(Brand, { foreignKey: 'organizationId' });
Brand.belongsTo(Organization, { foreignKey: 'organizationId' });
Brand.belongsTo(Country, { foreignKey: 'countryOfOrigin' });
Country.hasMany(Brand, { foreignKey: 'countryOfOrigin' });
Organization.hasMany(Category, { foreignKey: 'organizationId' });
Category.belongsTo(Organization, { foreignKey: 'organizationId' });
Category.belongsTo(Category, { as: 'parent', foreignKey: 'parentCategoryId' });
Category.hasMany(Category, { as: 'children', foreignKey: 'parentCategoryId' });
Organization.hasMany(UnitOfMeasure, { foreignKey: 'organizationId' });
UnitOfMeasure.belongsTo(Organization, { foreignKey: 'organizationId' });
UnitOfMeasure.belongsTo(UnitOfMeasure, { as: 'baseUom', foreignKey: 'baseUomId' });
UnitOfMeasure.hasMany(UnitOfMeasure, { foreignKey: 'baseUomId' });
Organization.hasMany(TaxRate, { foreignKey: 'organizationId' });
TaxRate.belongsTo(Organization, { foreignKey: 'organizationId' });
TaxRate.belongsTo(Country, { foreignKey: 'countryId' });
TaxRate.belongsTo(State, { foreignKey: 'stateId' });
Organization.hasMany(Product, { foreignKey: 'organizationId' });
Product.belongsTo(Organization, { foreignKey: 'organizationId' });
Product.belongsTo(Category, { foreignKey: 'categoryId' });
Product.belongsTo(Brand, { foreignKey: 'brandId' });
Product.belongsTo(TaxRate, { foreignKey: 'taxRateId' });
Product.belongsTo(UnitOfMeasure, { foreignKey: 'uomId' });
Product.belongsTo(UnitOfMeasure, { as: 'weightUom', foreignKey: 'weightUomId' });
Product.hasMany(ProductImage, { foreignKey: 'productId' });
ProductImage.belongsTo(Product, { foreignKey: 'productId' });
Product.hasMany(ProductVariant, { foreignKey: 'productId' });
ProductVariant.belongsTo(Product, { foreignKey: 'productId' });
Product.hasMany(ProductBundle, { as: 'bundleComponents', foreignKey: 'bundleProductId' });
Product.hasMany(ProductBundle, { as: 'componentOf', foreignKey: 'componentProductId' });
ProductBundle.belongsTo(Product, { foreignKey: 'bundleProductId' });
ProductBundle.belongsTo(Product, { foreignKey: 'componentProductId' });

// Warehouse & inventory
Organization.hasMany(Warehouse, { foreignKey: 'organizationId' });
Warehouse.belongsTo(Organization, { foreignKey: 'organizationId' });
Warehouse.belongsTo(City, { foreignKey: 'cityId' });
Warehouse.belongsTo(User, { as: 'manager', foreignKey: 'managerUserId' });
Warehouse.hasMany(StockLocation, { foreignKey: 'warehouseId' });
StockLocation.belongsTo(Warehouse, { foreignKey: 'warehouseId' });
StockLocation.belongsTo(StockLocation, { as: 'parent', foreignKey: 'parentLocationId' });
StockLocation.hasMany(StockLocation, { foreignKey: 'parentLocationId' });
Product.hasMany(Batch, { foreignKey: 'productId' });
Batch.belongsTo(Product, { foreignKey: 'productId' });
Warehouse.hasMany(Batch, { foreignKey: 'warehouseId' });
Batch.belongsTo(Warehouse, { foreignKey: 'warehouseId' });
Product.hasMany(SerialNumber, { foreignKey: 'productId' });
SerialNumber.belongsTo(Product, { foreignKey: 'productId' });
SerialNumber.belongsTo(Batch, { foreignKey: 'batchId' });
SerialNumber.belongsTo(Warehouse, { foreignKey: 'warehouseId' });
Product.hasMany(Stock, { foreignKey: 'productId' });
Stock.belongsTo(Product, { foreignKey: 'productId' });
Warehouse.hasMany(Stock, { foreignKey: 'warehouseId' });
Stock.belongsTo(Warehouse, { foreignKey: 'warehouseId' });
Stock.belongsTo(StockLocation, { foreignKey: 'locationId' });
Stock.belongsTo(User, { foreignKey: 'lastStockCheckBy' });
Product.hasMany(StockReservation, { foreignKey: 'productId' });
StockReservation.belongsTo(Product, { foreignKey: 'productId' });
Warehouse.hasMany(StockReservation, { foreignKey: 'warehouseId' });
StockReservation.belongsTo(Warehouse, { foreignKey: 'warehouseId' });
Organization.hasMany(InventoryTransaction, { foreignKey: 'organizationId' });
InventoryTransaction.belongsTo(Product, { foreignKey: 'productId' });
InventoryTransaction.belongsTo(Warehouse, { foreignKey: 'warehouseId' });
InventoryTransaction.belongsTo(Batch, { foreignKey: 'batchId' });
InventoryTransaction.belongsTo(SerialNumber, { foreignKey: 'serialNumberId' });
InventoryTransaction.belongsTo(User, { foreignKey: 'performedBy' });
Organization.hasMany(StockAdjustment, { foreignKey: 'organizationId' });
StockAdjustment.belongsTo(Product, { foreignKey: 'productId' });
StockAdjustment.belongsTo(Warehouse, { foreignKey: 'warehouseId' });
StockAdjustment.belongsTo(Batch, { foreignKey: 'batchId' });
StockAdjustment.belongsTo(User, { as: 'adjustedByUser', foreignKey: 'adjustedBy' });
StockAdjustment.belongsTo(User, { as: 'approvedByUser', foreignKey: 'approvedBy' });
Organization.hasMany(StockTransfer, { foreignKey: 'organizationId' });
StockTransfer.belongsTo(Warehouse, { as: 'fromWarehouse', foreignKey: 'fromWarehouseId' });
StockTransfer.belongsTo(Warehouse, { as: 'toWarehouse', foreignKey: 'toWarehouseId' });
StockTransfer.belongsTo(User, { as: 'createdByUser', foreignKey: 'createdBy' });
StockTransfer.belongsTo(User, { as: 'approvedByUser', foreignKey: 'approvedBy' });
StockTransfer.belongsTo(User, { as: 'receivedByUser', foreignKey: 'receivedBy' });
StockTransfer.hasMany(StockTransferItem, { foreignKey: 'transferId' });
StockTransferItem.belongsTo(StockTransfer, { foreignKey: 'transferId' });
StockTransferItem.belongsTo(Product, { foreignKey: 'productId' });
StockTransferItem.belongsTo(Batch, { foreignKey: 'batchId' });

export { sequelize };
export default sequelize;
