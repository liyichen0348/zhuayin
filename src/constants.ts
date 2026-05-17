import { Pet, Category, Notification } from './types.ts';

export const CATEGORIES: Category[] = [
  { id: '1', name: '狗狗', icon: 'PawPrint', active: true },
  { id: '2', name: '猫猫', icon: 'Cat' },
  { id: '3', name: '鸟类', icon: 'Leaf' },
  { id: '4', name: '其他', icon: 'CircleEllipsis' },
];

export const PETS: Pet[] = [
  {
    id: '1',
    name: 'Cooper',
    breed: '金毛寻回犬',
    age: '2岁',
    distance: '2.5公里',
    tags: ['活泼'],
    gender: '公',
    weight: '65磅',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCqaRRmMCaj77mR_iSdEZphOZGt0IFTQI29Ix07sk0soLrIWgmpmdck2O6mq2TOCDUWTyM2xU3v-qPb8gD25GVsXVOmFUscsfonWbMycULggN5cU8bm5T-EY6TUxV78B-PUQWPnU6VJFFVS061X94tB_nYNypgMXUBEu9HfmsOUcHDTcLSP-0SJSR6AmxVxxGy1A7GmU9WK-U-bnd-mf8wRkwp-dlPUE7HmZgsR4yMTS9zvAx4nTYjBmjbFlykdmr-hopTUqr1WR_0',
    personality: ['友善', '活泼', '对孩子友好', '易训练'],
    description: '巴迪是一个阳光开朗的大男孩，他的性格完全对得起他的名字。虽然他被发现时是一只流浪犬，但自被救助以来，他表现出了无限的爱意。他喜欢在公园里长时间散步，追逐网球，也喜欢在玩耍了一整天后依偎在沙发上。',
    healthStatus: ['已接种全套疫苗', '已绝育'],
    shelter: {
      name: '金心救援中心',
      type: '收容所',
      since: '2021年',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDTft96-aIOfCze25-zTewx8GWZpO9E51IlLO48VXm4pELyo1KxMXv-6u6vXJBv2-1zEaD6rM3xWUN4L1U3rDTQlnHuVIIv0WXC7sFuXFgmQcrxzFGjtaszZPntbBDSXDHsTS61e2lReE0M4XaxRZFLxnE8Byia6GcE8TTS2lYHRDr20oI3LvFOPvRiAG_LHLRAwyEwAB5Imz4nwoV960R8BozuYRwl7wU6WKSxj4q6FRCTA2pdRuBKicAO5PoWUvV6F4_ltsSqSA8'
    },
    adoptionFee: 250,
    status: '审核中',
    submittedAt: '2天前',
    urgent: true
  },
  {
    id: '2',
    name: 'Luna',
    breed: '西伯利亚猫',
    age: '1.5岁',
    distance: '4.0公里',
    tags: ['安静'],
    gender: '母',
    weight: '10磅',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDRsbrukNwFL3ecroMgeOeGof5meD8KLAd7X19Qag8Qq83mKhanqDI7pmGMT1YR3Q0JVTpOt8kHNJ7cdKNGYsCaZXXeVjfJ8oTY1b4TRUr0AGpQ-eDiEyAcSlkwFNRuH3xn8S3bFH4F4EWOcfmsed8cyam-KYVuY39OsxhK3ij9S8c42r2bq5rcaRnmvy62Sko1LErxgmITbVaaMUhXz6LnhwNT3gpL3XUw66sRQuYAAZZYA7y5frqpa6e6vKqbJ54WVk_8RdK3h9k',
    personality: ['安静', '亲人', '爱睡觉'],
    description: '露娜是一只优雅的西伯利亚猫，喜欢坐在窗台上观察外面的世界。',
    healthStatus: ['已接种全套疫苗'],
    shelter: {
      name: '爱心猫屋',
      type: '收容所',
      since: '2019年',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDTft96-aIOfCze25-zTewx8GWZpO9E51IlLO48VXm4pELyo1KxMXv-6u6vXJBv2-1zEaD6rM3xWUN4L1U3rDTQlnHuVIIv0WXC7sFuXFgmQcrxzFGjtaszZPntbBDSXDHsTS61e2lReE0M4XaxRZFLxnE8Byia6GcE8TTS2lYHRDr20oI3LvFOPvRiAG_LHLRAwyEwAB5Imz4nwoV960R8BozuYRwl7wU6WKSxj4q6FRCTA2pdRuBKicAO5PoWUvV6F4_ltsSqSA8'
    },
    adoptionFee: 150,
    status: '面试中'
  },
  {
    id: '3',
    name: 'Milo',
    breed: '法斗',
    age: '4个月',
    distance: '1.2公里',
    tags: ['可爱'],
    gender: '公',
    weight: '15磅',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAPYRozzzeAe84A3E9LpdB_7eqvxDC9va47imiG0W_z73nMLM2FvYNSONYSjkYjw-RJIzg1Tkym1cNegfSPWF-xIQP9SUZNlKHJdjL5QFMhVV5mCe4qy0kMNV5Vd2gUqthXCiNEgwSL3jNwsluY-H841ZrIPqmTIsDnbkdqoVslsCTthTHiXSc7RopSOx3hS5jIfdMTZpMN_Boo4gpeFKOzhnOpFc_1w_HdfuNH2ZmR30owuYJaSh27GJJJb7LDuBFY3LUwb4kr2ds',
    personality: ['淘气', '好奇'],
    description: '米洛是一个充满好奇心的小法斗。',
    healthStatus: [],
    shelter: {
      name: '阳光动物园',
      type: '救援中心',
      since: '2022年',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDTft96-aIOfCze25-zTewx8GWZpO9E51IlLO48VXm4pELyo1KxMXv-6u6vXJBv2-1zEaD6rM3xWUN4L1U3rDTQlnHuVIIv0WXC7sFuXFgmQcrxzFGjtaszZPntbBDSXDHsTS61e2lReE0M4XaxRZFLxnE8Byia6GcE8TTS2lYHRDr20oI3LvFOPvRiAG_LHLRAwyEwAB5Imz4nwoV960R8BozuYRwl7wU6WKSxj4q6FRCTA2pdRuBKicAO5PoWUvV6F4_ltsSqSA8'
    },
    adoptionFee: 300
  },
  {
    id: '4',
    name: 'Ginger',
    breed: '橘猫',
    age: '3岁',
    distance: '0.8公里',
    tags: ['稳重'],
    gender: '母',
    weight: '12磅',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCJGjYJNq1N7z8PaVkHFR_9XTpL_1JeMjqS8cO5nr6Dn9J-a3p8WSAsvYuFbsi5tbUgqIwkTgIBWcrxVi3JB9_yvoTZUttoQS2urNAOTaXDGVos9XH5tC0wVpLYJBF2IrLMhRBZ_DlgTMwfnLiP6FgEFE8-ViplJ4lNhhemGpewLpb8aYIIHojUOkNBP7PoN_AArbFoXgmdQc4LYEbOIJcw4VBht440Z8sdRSPYQPAGidbUMUF-smT2g6XAQubc5wz1J_PJVLZ5QjA',
    personality: ['稳重', '独立'],
    description: '姜姜是一只非常稳重的橘猫。',
    healthStatus: ['已绝育'],
    shelter: {
      name: '快乐猫舍',
      type: '收容所',
      since: '2020年',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDTft96-aIOfCze25-zTewx8GWZpO9E51IlLO48VXm4pELyo1KxMXv-6u6vXJBv2-1zEaD6rM3xWUN4L1U3rDTQlnHuVIIv0WXC7sFuXFgmQcrxzFGjtaszZPntbBDSXDHsTS61e2lReE0M4XaxRZFLxnE8Byia6GcE8TTS2lYHRDr20oI3LvFOPvRiAG_LHLRAwyEwAB5Imz4nwoV960R8BozuYRwl7wU6WKSxj4q6FRCTA2pdRuBKicAO5PoWUvV6F4_ltsSqSA8'
    },
    adoptionFee: 100
  }
];

export const NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    title: '申请状态更新',
    time: '10:30 AM',
    content: '好消息！您对 Buddy 的领养申请已获得初步批准。请查看后续步骤。',
    type: 'status',
    petImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCxTjQ1CedBWz8tgj3rx6vZkit3xn1ZOVkuXSLmOrkxmrR1FUJE4atawCxWI8neFlTMvZcc2PvdT6aPzOYUIj0aJT1FByJQDeWR7fiRNAJ0DfQzyOu4qYqUiEoSGkKJi2TI7MaP4S5DVGzwz06cyqbn73BgCPQEtcb65VmGU0n4o3iA5hQhC_zCEEwB0BDHfXleQytMO9bQFJtPLj0stRRP6McXBdUnnCYJ7J7A-WZPTH8v4VkodBE67Lkno0PmLkw8eoyvRM2nAs4',
    unread: true,
    date: '今天'
  },
  {
    id: '2',
    title: '来自收容所的新消息',
    time: '09:15 AM',
    content: 'Golden Hearts Rescue 给您发送了一条关于本周六见面预约的消息。',
    type: 'message',
    unread: true,
    date: '今天'
  },
  {
    id: '3',
    title: '为您推荐的新伙伴',
    time: '昨天',
    content: '根据您的偏好，附近有新的金毛寻回犬可供领养。快来看看有没有合眼缘的小家伙！',
    type: 'recommendation',
    date: '更早'
  },
  {
    id: '4',
    title: '健康提醒',
    time: '2天前',
    content: '记得带您的宠物进行定期体检哦。查看您领养协议中建议的疫苗接种时间表。',
    type: 'health',
    date: '更早'
  }
];
