import type { Tool, BorrowRecord, RepairOrder, CalendarBooking } from '../types';

export const tools: Tool[] = [
  {
    id: 't001',
    name: '博世电钻',
    category: '电动工具',
    specification: '18V锂电 / 最大扭矩60Nm / 两电一充',
    status: 'available',
    needTraining: true,
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20bosch%20cordless%20power%20drill%20on%20clean%20workbench%20product%20photo&image_size=square_hd',
    depositAmount: 200
  },
  {
    id: 't002',
    name: '铝合金折叠梯',
    category: '登高工具',
    specification: '3.5米 / 承重150kg / 防滑脚垫',
    status: 'borrowed',
    needTraining: false,
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=aluminum%20folding%20ladder%203%20meters%20tall%20product%20photo%20white%20background&image_size=square_hd',
    depositAmount: 100,
    currentBorrower: '王建国',
    expectedReturnDate: '2026-06-15'
  },
  {
    id: 't003',
    name: '平板手推车',
    category: '搬运工具',
    specification: '90x60cm / 承重300kg / 静音轮',
    status: 'available',
    needTraining: false,
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=heavy%20duty%20flatbed%20hand%20truck%20trolley%20cart%20product%20photo&image_size=square_hd',
    depositAmount: 50
  },
  {
    id: 't004',
    name: '园林绿化剪',
    category: '园艺工具',
    specification: 'SK5钢刀刃 / 省力棘轮 / 长度65cm',
    status: 'repairing',
    needTraining: false,
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20garden%20hedge%20shears%20pruning%20scissors%20product%20photo&image_size=square_hd',
    depositAmount: 80
  },
  {
    id: 't005',
    name: '高压清洗机',
    category: '清洁设备',
    specification: '2200W / 最大压力150bar / 自吸两用',
    status: 'pending',
    needTraining: true,
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=electric%20high%20pressure%20washer%20cleaner%20machine%20product%20photo&image_size=square_hd',
    depositAmount: 300,
    currentBorrower: '李明华',
    expectedReturnDate: '2026-06-12'
  },
  {
    id: 't006',
    name: '角磨机',
    category: '电动工具',
    specification: '800W / 100mm / 无级调速',
    status: 'available',
    needTraining: true,
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=electric%20angle%20grinder%20power%20tool%20product%20photo%20professional&image_size=square_hd',
    depositAmount: 150
  },
  {
    id: 't007',
    name: '人字梯',
    category: '登高工具',
    specification: '2米 / 双面可登 / 防滑踏板',
    status: 'scrapped',
    needTraining: false,
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=A%20frame%20step%20ladder%202%20meters%20product%20photo&image_size=square_hd',
    depositAmount: 60
  },
  {
    id: 't008',
    name: '电动螺丝刀套装',
    category: '电动工具',
    specification: '3.6V锂电 / 48件批头套装',
    status: 'borrowed',
    needTraining: false,
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=electric%20screwdriver%20set%20with%20bits%20kit%20product%20photo&image_size=square_hd',
    depositAmount: 80,
    currentBorrower: '张小梅',
    expectedReturnDate: '2026-06-14'
  }
];

export const borrowRecords: BorrowRecord[] = [
  {
    id: 'b001',
    toolId: 't002',
    toolName: '铝合金折叠梯',
    borrowerName: '王建国',
    borrowerPhone: '138****2341',
    borrowDate: '2026-06-10',
    expectedReturnDate: '2026-06-15',
    depositAmount: 100,
    depositStatus: 'held'
  },
  {
    id: 'b002',
    toolId: 't005',
    toolName: '高压清洗机',
    borrowerName: '李明华',
    borrowerPhone: '139****5678',
    borrowDate: '2026-06-08',
    expectedReturnDate: '2026-06-12',
    depositAmount: 300,
    depositStatus: 'refunding'
  },
  {
    id: 'b003',
    toolId: 't008',
    toolName: '电动螺丝刀套装',
    borrowerName: '张小梅',
    borrowerPhone: '137****8901',
    borrowDate: '2026-06-11',
    expectedReturnDate: '2026-06-14',
    depositAmount: 80,
    depositStatus: 'held'
  },
  {
    id: 'b004',
    toolId: 't004',
    toolName: '园林绿化剪',
    borrowerName: '赵德柱',
    borrowerPhone: '136****3456',
    borrowDate: '2026-06-05',
    expectedReturnDate: '2026-06-10',
    actualReturnDate: '2026-06-10',
    depositAmount: 80,
    depositStatus: 'refunded',
    hasDamage: true
  }
];

export const repairOrders: RepairOrder[] = [
  {
    id: 'r001',
    toolId: 't004',
    toolName: '园林绿化剪',
    damageArea: '刀刃转轴处',
    description: '刀刃松动，转轴螺丝磨损，剪切时打滑',
    progress: 60,
    priority: 'medium',
    repairer: '刘师傅',
    createdAt: '2026-06-10'
  },
  {
    id: 'r002',
    toolId: 't007',
    toolName: '人字梯',
    damageArea: '左侧踏板连接处',
    description: '踏板焊接处断裂，存在安全隐患，建议报废',
    progress: 100,
    priority: 'high',
    repairer: '刘师傅',
    createdAt: '2026-06-08'
  }
];

export const calendarBookings: CalendarBooking[] = [
  { id: 'c001', toolId: 't002', toolName: '铝合金折叠梯', date: '2026-06-10', borrowerName: '王建国', type: 'borrow' },
  { id: 'c002', toolId: 't002', toolName: '铝合金折叠梯', date: '2026-06-15', borrowerName: '王建国', type: 'return' },
  { id: 'c003', toolId: 't005', toolName: '高压清洗机', date: '2026-06-08', borrowerName: '李明华', type: 'borrow' },
  { id: 'c004', toolId: 't005', toolName: '高压清洗机', date: '2026-06-12', borrowerName: '李明华', type: 'return' },
  { id: 'c005', toolId: 't008', toolName: '电动螺丝刀套装', date: '2026-06-11', borrowerName: '张小梅', type: 'borrow' },
  { id: 'c006', toolId: 't008', toolName: '电动螺丝刀套装', date: '2026-06-14', borrowerName: '张小梅', type: 'return' },
  { id: 'c007', toolId: 't001', toolName: '博世电钻', date: '2026-06-13', borrowerName: '陈大力', type: 'borrow' },
  { id: 'c008', toolId: 't001', toolName: '博世电钻', date: '2026-06-18', borrowerName: '陈大力', type: 'return' }
];
