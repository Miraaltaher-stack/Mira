/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { 
  BookOpen, 
  PenTool, 
  Search, 
  Star, 
  ChevronRight, 
  Volume2, 
  CheckCircle2, 
  ArrowLeft,
  Sparkles,
  Heart
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Helper for tailwind classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Types ---
interface Lesson {
  id: string;
  character: string;
  pinyin: string;
  arabic: string;
  example: string;
}

const LESSONS: Lesson[] = [
  { id: '1', character: '人', pinyin: 'rén', arabic: 'شخص', example: '一个人 (One person)' },
  { id: '2', character: '山', pinyin: 'shān', arabic: 'جبل', example: '大山 (Big mountain)' },
  { id: '3', character: '水', pinyin: 'shuǐ', arabic: 'ماء', example: '喝水 (Drink water)' },
  { id: '4', character: '火', pinyin: 'huǒ', arabic: 'نار', example: '大火 (Big fire)' },
  { id: '5', character: '木', pinyin: 'mù', arabic: 'خشب', example: '木头 (Wood)' },
  { id: '6', character: '月', pinyin: 'yuè', arabic: 'قمر', example: '月亮 (Moon)' },
  { id: '7', character: '日', pinyin: 'rì', arabic: 'شمس', example: '太阳 (Sun)' },
  { id: '8', character: '口', pinyin: 'kǒu', arabic: 'فم', example: '张口 (Open mouth)' },
  { id: '9', character: '心', pinyin: 'xīn', arabic: 'قلب', example: '爱心 (Love heart)' },
  { id: '10', character: '天', pinyin: 'tiān', arabic: 'سماء', example: '蓝天 (Blue sky)' },
  { id: '11', character: '大', pinyin: 'dà', arabic: 'كبير', example: '大人 (Adult)' },
  { id: '12', character: '小', pinyin: 'xiǎo', arabic: 'صغير', example: '小孩 (Child)' },
  { id: '13', character: '好', pinyin: 'hǎo', arabic: 'جيد', example: '你好 (Hello)' },
  { id: '14', character: '妈', pinyin: 'mā', arabic: 'أم', example: '妈妈 (Mom)' },
  { id: '15', character: '爸', pinyin: 'bà', arabic: 'أب', example: '爸爸 (Dad)' },
  { id: '16', character: '爱', pinyin: 'ài', arabic: 'حب', example: '我爱你 (I love you)' },
  { id: '17', character: '猫', pinyin: 'māo', arabic: 'قطة', example: '小猫 (Kitten)' },
  { id: '18', character: '狗', pinyin: 'gǒu', arabic: 'كلب', example: '小狗 (Puppy)' },
  { id: '19', character: '花', pinyin: 'huā', arabic: 'زهرة', example: '红花 (Red flower)' },
  { id: '20', character: '草', pinyin: 'cǎo', arabic: 'عشب', example: '绿草 (Green grass)' },
  { id: '21', character: '云', pinyin: 'yún', arabic: 'سحاب', example: '白云 (White cloud)' },
  { id: '22', character: '雨', pinyin: 'yǔ', arabic: 'مطر', example: '下雨 (Raining)' },
  { id: '23', character: '风', pinyin: 'fēng', arabic: 'ريح', example: '大风 (Strong wind)' },
  { id: '24', character: '电', pinyin: 'diàn', arabic: 'كهرباء', example: '闪电 (Lightning)' },
  { id: '25', character: '车', pinyin: 'chē', arabic: 'سيارة', example: '开车 (Driving)' },
  { id: '26', character: '书', pinyin: 'shū', arabic: 'كتاب', example: '看书 (Reading)' },
  { id: '27', character: '笔', pinyin: 'bǐ', arabic: 'قلم', example: '铅笔 (Pencil)' },
  { id: '28', character: '纸', pinyin: 'zhǐ', arabic: 'ورق', example: '白纸 (White paper)' },
  { id: '29', character: '桌', pinyin: 'zhuō', arabic: 'طاولة', example: '桌子 (Table)' },
  { id: '30', character: '椅', pinyin: 'yǐ', arabic: 'كرسي', example: '椅子 (Chair)' },
  { id: '31', character: '一', pinyin: 'yī', arabic: 'واحد', example: '一个 (One)' },
  { id: '32', character: '二', pinyin: 'èr', arabic: 'اثنان', example: '两个 (Two)' },
  { id: '33', character: '三', pinyin: 'sān', arabic: 'ثلاثة', example: '三个 (Three)' },
  { id: '34', character: '四', pinyin: 'sì', arabic: 'أربعة', example: '四个 (Four)' },
  { id: '35', character: '五', pinyin: 'wǔ', arabic: 'خمسة', example: '五个 (Five)' },
  { id: '36', character: '六', pinyin: 'liù', arabic: 'ستة', example: '六个 (Six)' },
  { id: '37', character: '七', pinyin: 'qī', arabic: 'سبعة', example: '七个 (Seven)' },
  { id: '38', character: '八', pinyin: 'bā', arabic: 'ثمانية', example: '八个 (Eight)' },
  { id: '39', character: '九', pinyin: 'jiǔ', arabic: 'تسعة', example: '九个 (Nine)' },
  { id: '40', character: '十', pinyin: 'shí', arabic: 'عشرة', example: '十个 (Ten)' },
  { id: '41', character: '红', pinyin: 'hóng', arabic: 'أحمر', example: '红花 (Red flower)' },
  { id: '42', character: '黄', pinyin: 'huáng', arabic: 'أصفر', example: '黄花 (Yellow flower)' },
  { id: '43', character: '蓝', pinyin: 'lán', arabic: 'أزرق', example: '蓝天 (Blue sky)' },
  { id: '44', character: '绿', pinyin: 'lǜ', arabic: 'أخضر', example: '绿草 (Green grass)' },
  { id: '45', character: '黑', pinyin: 'hēi', arabic: 'أسود', example: '黑猫 (Black cat)' },
  { id: '46', character: '白', pinyin: 'bái', arabic: 'أبيض', example: '白云 (White cloud)' },
  { id: '47', character: '大', pinyin: 'dà', arabic: 'كبير', example: '大山 (Big mountain)' },
  { id: '48', character: '小', pinyin: 'xiǎo', arabic: 'صغير', example: '小狗 (Small dog)' },
  { id: '49', character: '长', pinyin: 'cháng', arabic: 'طويل', example: '长路 (Long road)' },
  { id: '50', character: '短', pinyin: 'duǎn', arabic: 'قصير', example: '短发 (Short hair)' },
  { id: '51', character: '高', pinyin: 'gāo', arabic: 'عالي', example: '高山 (High mountain)' },
  { id: '52', character: '低', pinyin: 'dī', arabic: 'منخفض', example: '低头 (Lower head)' },
  { id: '53', character: '多', pinyin: 'duō', arabic: 'كثير', example: '多人 (Many people)' },
  { id: '54', character: '少', pinyin: 'shǎo', arabic: 'قليل', example: '少见 (Rare)' },
  { id: '55', character: '远', pinyin: 'yuǎn', arabic: 'بعيد', example: '远方 (Far away)' },
  { id: '56', character: '近', pinyin: 'jìn', arabic: 'قريب', example: '近处 (Nearby)' },
  { id: '57', character: '左', pinyin: 'zuǒ', arabic: 'يسار', example: '左边 (Left side)' },
  { id: '58', character: '右', pinyin: 'yòu', arabic: 'يمين', example: '右边 (Right side)' },
  { id: '59', character: '上', pinyin: 'shàng', arabic: 'فوق', example: '上面 (Above)' },
  { id: '60', character: '下', pinyin: 'xià', arabic: 'تحت', example: '下面 (Below)' },
  { id: '61', character: '我', pinyin: 'wǒ', arabic: 'أنا', example: '我是 (I am)' },
  { id: '62', character: '你', pinyin: 'nǐ', arabic: 'أنت', example: '你好 (Hello)' },
  { id: '63', character: '他', pinyin: 'tā', arabic: 'هو', example: '他是 (He is)' },
  { id: '64', character: '她', pinyin: 'tā', arabic: 'هي', example: '她是 (She is)' },
  { id: '65', character: '我们', pinyin: 'wǒmen', arabic: 'نحن', example: '我们是 (We are)' },
  { id: '66', character: '你们', pinyin: 'nǐmen', arabic: 'أنتم', example: '你们好 (Hello everyone)' },
  { id: '67', character: '他们', pinyin: 'tāmen', arabic: 'هم', example: '他们是 (They are)' },
  { id: '68', character: '这', pinyin: 'zhè', arabic: 'هذا', example: '这是 (This is)' },
  { id: '69', character: '那', pinyin: 'nà', arabic: 'ذاك', example: '那是 (That is)' },
  { id: '70', character: '谁', pinyin: 'shéi', arabic: 'من', example: '你是谁 (Who are you)' },
  { id: '71', character: '什么', pinyin: 'shénme', arabic: 'ماذا', example: '这是什么 (What is this)' },
  { id: '72', character: '哪里', pinyin: 'nǎlǐ', arabic: 'أين', example: '你在哪里 (Where are you)' },
  { id: '73', character: '什么时候', pinyin: 'shénme shíhou', arabic: 'متى', example: '什么时候去 (When to go)' },
  { id: '74', character: '为什么', pinyin: 'wèishénme', arabic: 'لماذا', example: '为什么不 (Why not)' },
  { id: '75', character: '怎么', pinyin: 'zěnme', arabic: 'كيف', example: '怎么做 (How to do)' },
  { id: '76', character: '多少', pinyin: 'duōshǎo', arabic: 'كم', example: '多少钱 (How much)' },
  { id: '77', character: '几', pinyin: 'jǐ', arabic: 'كم (للعدد القليل)', example: '几个 (How many)' },
  { id: '78', character: '岁', pinyin: 'suì', arabic: 'سنة (عمر)', example: '几岁 (How old)' },
  { id: '79', character: '点', pinyin: 'diǎn', arabic: 'ساعة', example: '几点 (What time)' },
  { id: '80', character: '分', pinyin: 'fēn', arabic: 'دقيقة', example: '十分 (Ten minutes)' },
  { id: '81', character: '年', pinyin: 'nián', arabic: 'سنة', example: '今年 (This year)' },
  { id: '82', character: '月', pinyin: 'yuè', arabic: 'شهر', example: '这个月 (This month)' },
  { id: '83', character: '日', pinyin: 'rì', arabic: 'يوم', example: '今日 (Today)' },
  { id: '84', character: '星期', pinyin: 'xīngqī', arabic: 'أسبوع', example: '星期一 (Monday)' },
  { id: '85', character: '天', pinyin: 'tiān', arabic: 'يوم', example: '每天 (Every day)' },
  { id: '86', character: '今天', pinyin: 'jīntiān', arabic: 'اليوم', example: '今天好 (Today is good)' },
  { id: '87', character: '明天', pinyin: 'míngtiān', arabic: 'غداً', example: '明天见 (See you tomorrow)' },
  { id: '88', character: '昨天', pinyin: 'zuótiān', arabic: 'أمس', example: '昨天去 (Went yesterday)' },
  { id: '89', character: '现在', pinyin: 'xiànzài', arabic: 'الآن', example: '现在几点 (What time is it now)' },
  { id: '90', character: '以后', pinyin: 'yǐhòu', arabic: 'بعد', example: '以后见 (See you later)' },
  { id: '91', character: '以前', pinyin: 'yǐqián', arabic: 'قبل', example: '以前好 (Used to be good)' },
  { id: '92', character: '开始', pinyin: 'kāishǐ', arabic: 'بدأ', example: '开始吧 (Let\'s start)' },
  { id: '93', character: '结束', pinyin: 'jiéshù', arabic: 'انتهى', example: '结束了 (It\'s over)' },
  { id: '94', character: '去', pinyin: 'qù', arabic: 'ذهب', example: '去学校 (Go to school)' },
  { id: '95', character: '来', pinyin: 'lái', arabic: 'أتى', example: '来这里 (Come here)' },
  { id: '96', character: '坐', pinyin: 'zuò', arabic: 'جلس', example: '请坐 (Please sit)' },
  { id: '97', character: '站', pinyin: 'zhàn', arabic: 'وقف', example: '站起来 (Stand up)' },
  { id: '98', character: '走', pinyin: 'zǒu', arabic: 'مشى', example: '走吧 (Let\'s go)' },
  { id: '99', character: '跑', pinyin: 'pǎo', arabic: 'ركض', example: '跑步 (Running)' },
  { id: '100', character: '跳', pinyin: 'tiào', arabic: 'قفز', example: '跳舞 (Dancing)' },
  { id: '101', character: '看', pinyin: 'kàn', arabic: 'نظر', example: '看书 (Reading)' },
  { id: '102', character: '听', pinyin: 'tīng', arabic: 'سمع', example: '听音乐 (Listening to music)' },
  { id: '103', character: '说', pinyin: 'shuō', arabic: 'تكلم', example: '说话 (Speaking)' },
  { id: '104', character: '读', pinyin: 'dú', arabic: 'قرأ', example: '读书 (Reading)' },
  { id: '105', character: '写', pinyin: 'xiě', arabic: 'كتب', example: '写字 (Writing)' },
  { id: '106', character: '吃', pinyin: 'chī', arabic: 'أكل', example: '吃饭 (Eating)' },
  { id: '107', character: '喝', pinyin: 'hē', arabic: 'شرب', example: '喝水 (Drinking water)' },
  { id: '108', character: '玩', pinyin: 'wán', arabic: 'لعب', example: '玩耍 (Playing)' },
  { id: '109', character: '睡', pinyin: 'shuì', arabic: 'نام', example: '睡觉 (Sleeping)' },
  { id: '110', character: '觉', pinyin: 'jiào', arabic: 'نوم', example: '睡觉 (Sleeping)' },
  { id: '111', character: '想', pinyin: 'xiǎng', arabic: 'فكر', example: '想念 (Missing someone)' },
  { id: '112', character: '知道', pinyin: 'zhīdào', arabic: 'عرف', example: '我知道 (I know)' },
  { id: '113', character: '认识', pinyin: 'rènshi', arabic: 'تعرف', example: '认识你 (Meet you)' },
  { id: '114', character: '觉得', pinyin: 'juéde', arabic: 'شعر', example: '觉得好 (Feel good)' },
  { id: '115', character: '喜欢', pinyin: 'xǐhuan', arabic: 'أحب', example: '喜欢你 (Like you)' },
  { id: '116', character: '爱', pinyin: 'ài', arabic: 'حب', example: '爱妈妈 (Love mom)' },
  { id: '117', character: '恨', pinyin: 'hèn', arabic: 'كره', example: '恨你 (Hate you)' },
  { id: '118', character: '怕', pinyin: 'pà', arabic: 'خاف', example: '害怕 (Afraid)' },
  { id: '119', character: '笑', pinyin: 'xiào', arabic: 'ضحك', example: '大笑 (Laughing)' },
  { id: '120', character: '哭', pinyin: 'kū', arabic: 'بكى', example: '大哭 (Crying)' },
  { id: '121', character: '累', pinyin: 'lèi', arabic: 'تعب', example: '很累 (Very tired)' },
  { id: '122', character: '饿', pinyin: 'è', arabic: 'جاع', example: '很饿 (Very hungry)' },
  { id: '123', character: '渴', pinyin: 'kě', arabic: 'عطش', example: '很渴 (Very thirsty)' },
  { id: '124', character: '忙', pinyin: 'máng', arabic: 'مشغول', example: '很忙 (Very busy)' },
  { id: '125', character: '快', pinyin: 'kuài', arabic: 'سريع', example: '很快 (Very fast)' },
  { id: '126', character: '慢', pinyin: 'màn', arabic: 'بطيء', example: '很慢 (Very slow)' },
  { id: '127', character: '难', pinyin: 'nán', arabic: 'صعب', example: '很难 (Very difficult)' },
  { id: '128', character: '易', pinyin: 'yì', arabic: 'سهل', example: '容易 (Easy)' },
  { id: '129', character: '对', pinyin: 'duì', arabic: 'صحيح', example: '是对的 (It is right)' },
  { id: '130', character: '错', pinyin: 'cuò', arabic: 'خطأ', example: '是错的 (It is wrong)' },
  { id: '131', character: '真', pinyin: 'zhēn', arabic: 'حقيقي', example: '真的吗 (Really?)' },
  { id: '132', character: '假', pinyin: 'jiǎ', arabic: 'مزيف', example: '假的 (Fake)' },
  { id: '133', character: '新', pinyin: 'xīn', arabic: 'جديد', example: '新衣服 (New clothes)' },
  { id: '134', character: '旧', pinyin: 'jiù', arabic: 'قديم', example: '旧书 (Old book)' },
  { id: '135', character: '贵', pinyin: 'guì', arabic: 'غالي', example: '很贵 (Very expensive)' },
  { id: '136', character: '便宜', pinyin: 'piányi', arabic: 'رخيص', example: '很便宜 (Very cheap)' },
  { id: '137', character: '冷', pinyin: 'lěng', arabic: 'بارد', example: '很冷 (Very cold)' },
  { id: '138', character: '热', pinyin: 'rè', arabic: 'حار', example: '很热 (Very hot)' },
  { id: '139', character: '晴', pinyin: 'qíng', arabic: 'مشمس', example: '晴天 (Sunny day)' },
  { id: '140', character: '阴', pinyin: 'yīn', arabic: 'غائم', example: '阴天 (Cloudy day)' },
  { id: '141', character: '风', pinyin: 'fēng', arabic: 'ريح', example: '刮风 (Windy)' },
  { id: '142', character: '雪', pinyin: 'xuě', arabic: 'ثلج', example: '下雪 (Snowing)' },
  { id: '143', character: '电', pinyin: 'diàn', arabic: 'برق', example: '闪电 (Lightning)' },
  { id: '144', character: '雷', pinyin: 'léi', arabic: 'رعد', example: '打雷 (Thundering)' },
  { id: '145', character: '雾', pinyin: 'wù', arabic: 'ضباب', example: '大雾 (Foggy)' },
  { id: '146', character: '山', pinyin: 'shān', arabic: 'جبل', example: '爬山 (Climbing mountain)' },
  { id: '147', character: '水', pinyin: 'shuǐ', arabic: 'ماء', example: '流水 (Flowing water)' },
  { id: '148', character: '林', pinyin: 'lín', arabic: 'غابة', example: '森林 (Forest)' },
  { id: '149', character: '森', pinyin: 'sēn', arabic: 'غابة كثيفة', example: '森林 (Forest)' },
  { id: '150', character: '木', pinyin: 'mù', arabic: 'خشب', example: '木头 (Wood)' },
];

const APP_ICON = "https://storage.googleapis.com/static.run.app/aistudio/u2jlb4jsisay6yfafdggn5/176742820331/image_93.png";
const BG_IMAGE = "https://storage.googleapis.com/static.run.app/aistudio/u2jlb4jsisay6yfafdggn5/176742820331/image_93.png";

// --- Tracing Canvas Component ---
const TracingCanvas = ({ character, onClear, isDark = false }: { character: string, onClear: (clearFn: () => void) => void, isDark?: boolean }) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.lineWidth = 12;
    ctx.strokeStyle = isDark ? '#fdba74' : '#f97316'; // orange-300 or orange-500

    onClear(() => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    });
  }, [onClear, isDark]);

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.beginPath();
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    let x, y;

    if ('touches' in e) {
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  return (
    <div className={cn(
      "relative w-64 h-64 mx-auto rounded-[40px] border-4 border-dashed flex items-center justify-center overflow-hidden shadow-inner transition-colors",
      isDark ? "bg-slate-800 border-slate-700" : "bg-white border-orange-200"
    )}>
      <span className={cn(
        "text-[160px] font-serif select-none absolute inset-0 flex items-center justify-center pointer-events-none",
        isDark ? "text-slate-700/50" : "text-slate-100"
      )}>
        {character}
      </span>
      <canvas
        ref={canvasRef}
        width={256}
        height={256}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseOut={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
        className="absolute inset-0 z-10 touch-none cursor-crosshair"
      />
    </div>
  );
};

// --- Components ---

const Header = ({ onBack, title, isDark = false }: { onBack?: () => void, title: string, isDark?: boolean }) => (
  <header className={cn(
    "p-6 flex items-center justify-between backdrop-blur-md sticky top-0 z-50 border-b transition-colors",
    isDark ? "bg-slate-900/80 border-slate-800" : "bg-white/80 border-orange-100"
  )}>
    <div className="flex items-center gap-4">
      {onBack && (
        <button onClick={onBack} className={cn(
          "p-2 rounded-full transition-colors",
          isDark ? "hover:bg-slate-800" : "hover:bg-orange-50"
        )}>
          <ArrowLeft size={24} className={isDark ? "text-orange-300" : "text-orange-500"} />
        </button>
      )}
      <div className="flex items-center gap-3">
        <div className={cn(
          "w-12 h-12 rounded-2xl flex items-center justify-center overflow-hidden border-2 shadow-sm",
          isDark ? "bg-slate-800 border-slate-700" : "bg-orange-100 border-orange-200"
        )}>
          <img 
            src={APP_ICON} 
            alt="Mira Logo" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <h1 className={cn(
          "font-black text-2xl tracking-tight",
          isDark ? "text-orange-300" : "text-orange-600"
        )}>{title}</h1>
      </div>
    </div>
    <div className={cn(
      "flex items-center gap-2 px-4 py-2 rounded-full border transition-colors",
      isDark ? "bg-slate-800 border-slate-700" : "bg-orange-50 border-orange-100"
    )}>
      <Star size={18} className="text-yellow-500 fill-yellow-500" />
      <span className={cn(
        "font-bold",
        isDark ? "text-orange-300" : "text-orange-700"
      )}>120</span>
    </div>
  </header>
);

interface CharacterCardProps {
  lesson: Lesson;
  onClick: () => void;
  onSpeak: (e: React.MouseEvent) => void;
}

const CharacterCard: React.FC<CharacterCardProps> = ({ lesson, onClick, onSpeak }) => (
  <motion.button
    whileHover={{ scale: 1.02, y: -4 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className="bg-white p-6 rounded-[32px] border-2 border-orange-50 shadow-sm hover:shadow-md hover:border-orange-200 transition-all text-center flex flex-col items-center gap-3 relative overflow-hidden group"
  >
    <button 
      onClick={onSpeak}
      className="absolute top-4 right-4 p-2 bg-orange-50 text-orange-500 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity hover:bg-orange-100"
    >
      <Volume2 size={18} />
    </button>
    <span className="text-6xl font-serif text-slate-800">{lesson.character}</span>
    <div className="space-y-1">
      <p className="text-sm font-bold text-orange-500 uppercase tracking-widest">{lesson.pinyin}</p>
      <p className="text-xl font-bold text-slate-600" dir="rtl">{lesson.arabic}</p>
    </div>
  </motion.button>
);

export default function App() {
  const [view, setView] = useState<'home' | 'lessons' | 'practice' | 'dictionary'>('home');
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [translation, setTranslation] = useState<{ chinese: string, pinyin: string, arabic: string } | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [practiceIndex, setPracticeIndex] = useState(0);
  const [visibleLessons, setVisibleLessons] = useState(12);
  const clearCanvasRef = React.useRef<(() => void) | null>(null);

  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'zh-CN';
    window.speechSynthesis.speak(utterance);
  };

  const handleTranslate = async () => {
    if (!searchQuery.trim()) return;
    setIsTranslating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Translate this Arabic word or phrase to Chinese for a child: "${searchQuery}". 
        Provide the Chinese character(s), Pinyin, and the Arabic meaning. 
        Keep it simple and fun.
        Return JSON format: { "chinese": "...", "pinyin": "...", "arabic": "..." }`,
        config: { 
          responseMimeType: 'application/json',
          systemInstruction: "You are a friendly Chinese teacher for Arabic-speaking kids. Keep translations simple and educational."
        }
      });
      const data = JSON.parse(response.text);
      setTranslation(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <div 
      className="min-h-screen text-slate-800 font-sans selection:bg-orange-200 relative"
      style={{
        backgroundImage: `linear-gradient(rgba(255, 251, 245, 0.85), rgba(255, 251, 245, 0.85)), url(${BG_IMAGE})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <AnimatePresence mode="wait">
        {view === 'home' && (
          <motion.div 
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-4xl mx-auto p-6 space-y-12 pt-12"
          >
            <div className="text-center space-y-6">
              <motion.div 
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                whileHover={{ rotateY: 15, rotateX: -15, scale: 1.05 }}
                className="w-48 h-48 mx-auto bg-white rounded-[48px] shadow-[0_20px_50px_rgba(249,115,22,0.3)] border-4 border-orange-100 flex items-center justify-center overflow-hidden cursor-pointer perspective-1000"
                style={{ transformStyle: 'preserve-3d' }}
              >
                <img 
                  src={APP_ICON} 
                  alt="Mira Logo" 
                  className="w-full h-full object-cover"
                  style={{ transform: 'translateZ(20px)' }}
                  referrerPolicy="no-referrer"
                />
              </motion.div>
              <div className="space-y-2">
                <h1 className="text-5xl font-black text-orange-600 tracking-tighter">Mira Learn Chinese</h1>
                <p className="text-xl font-medium text-slate-500" dir="rtl">تعلم الصينية مع ميرا بكل سهولة ومرح!</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <MenuButton 
                icon={<BookOpen className="text-blue-500" />}
                title="الدروس"
                subtitle="Lessons"
                color="bg-blue-50"
                onClick={() => setView('lessons')}
              />
              <MenuButton 
                icon={<PenTool className="text-purple-500" />}
                title="ممارسة"
                subtitle="Practice"
                color="bg-purple-50"
                onClick={() => setView('practice')}
              />
              <MenuButton 
                icon={<Search className="text-orange-500" />}
                title="قاموس"
                subtitle="Dictionary"
                color="bg-orange-50"
                onClick={() => setView('dictionary')}
              />
            </div>

            <div className="bg-white p-8 rounded-[40px] border-2 border-orange-50 shadow-sm flex items-center gap-6">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center shrink-0">
                <Sparkles className="text-yellow-600" size={32} />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-lg">نصيحة اليوم</h3>
                <p className="text-slate-500 italic">"اللغة الصينية مثل الرسم، كل حرف يحكي قصة!"</p>
              </div>
            </div>
          </motion.div>
        )}

        {view === 'lessons' && (
          <motion.div 
            key="lessons"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
          >
            <Header title="الدروس الأساسية" onBack={() => setView('home')} />
            <div className="max-w-4xl mx-auto p-6 space-y-8">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {LESSONS.slice(0, visibleLessons).map(lesson => (
                  <CharacterCard 
                    key={lesson.id} 
                    lesson={lesson} 
                    onClick={() => setSelectedLesson(lesson)} 
                    onSpeak={(e) => {
                      e.stopPropagation();
                      speak(lesson.character);
                    }}
                  />
                ))}
              </div>
              {visibleLessons < LESSONS.length && (
                <div className="text-center pt-8">
                  <button 
                    onClick={() => setVisibleLessons(prev => prev + 12)}
                    className="bg-white border-2 border-orange-200 text-orange-600 px-8 py-4 rounded-2xl font-bold hover:bg-orange-50 transition-colors shadow-sm"
                  >
                    تحميل المزيد من الكلمات
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {view === 'dictionary' && (
          <motion.div 
            key="dictionary"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
          >
            <Header title="القاموس الذكي" onBack={() => setView('home')} />
            <div className="max-w-2xl mx-auto p-6 space-y-8">
              <div className="relative">
                <input 
                  type="text"
                  placeholder="اكتب كلمة بالعربية..."
                  dir="rtl"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full p-6 pr-16 rounded-[32px] border-2 border-orange-100 focus:border-orange-400 focus:outline-none text-xl font-bold shadow-sm"
                />
                <button 
                  onClick={handleTranslate}
                  disabled={isTranslating}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-orange-500 text-white p-3 rounded-2xl hover:bg-orange-600 transition-colors disabled:opacity-50"
                >
                  {isTranslating ? <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Search size={24} />}
                </button>
              </div>

              {translation && (
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="bg-white p-12 rounded-[48px] border-2 border-orange-50 shadow-xl text-center space-y-6"
                >
                  <span className="text-9xl font-serif text-slate-800 block">{translation.chinese}</span>
                  <div className="space-y-2">
                    <p className="text-2xl font-black text-orange-500 uppercase tracking-widest">{translation.pinyin}</p>
                    <p className="text-4xl font-black text-slate-600" dir="rtl">{translation.arabic}</p>
                  </div>
                  <button 
                    onClick={() => speak(translation.chinese)}
                    className="flex items-center gap-2 mx-auto bg-orange-50 text-orange-600 px-6 py-3 rounded-full font-bold hover:bg-orange-100 transition-colors"
                  >
                    <Volume2 size={20} /> استمع للنطق
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}

        {view === 'practice' && (
          <motion.div 
            key="practice"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            className="min-h-screen bg-slate-900/95 text-slate-100 backdrop-blur-sm"
          >
            <Header title="ممارسة الكتابة" onBack={() => setView('home')} isDark />
            <div className="max-w-4xl mx-auto p-6 text-center space-y-8">
              <div className="flex justify-between items-center bg-slate-800 p-4 rounded-3xl border-2 border-slate-700 mb-4">
                <div className="text-right">
                  <p className="text-xs font-black text-orange-300 uppercase tracking-widest">Pinyin</p>
                  <p className="text-xl font-black text-orange-400">{LESSONS[practiceIndex].pinyin}</p>
                </div>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => speak(LESSONS[practiceIndex].character)}
                    className="p-3 bg-slate-700 text-orange-300 rounded-2xl hover:bg-slate-600 transition-colors"
                  >
                    <Volume2 size={24} />
                  </button>
                </div>
                <div className="text-left">
                  <p className="text-xs font-black text-orange-300 uppercase tracking-widest">Arabic</p>
                  <p className="text-xl font-black text-slate-300" dir="rtl">{LESSONS[practiceIndex].arabic}</p>
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-3xl font-black text-orange-300">ارسم الحرف:</h2>
                <TracingCanvas 
                  character={LESSONS[practiceIndex].character} 
                  onClear={(fn) => clearCanvasRef.current = fn} 
                  isDark
                />
              </div>
              
              <div className="flex flex-col gap-4 max-w-xs mx-auto">
                <div className="flex gap-4">
                  <button 
                    onClick={() => clearCanvasRef.current?.()}
                    className="flex-1 bg-slate-800 text-slate-300 px-6 py-4 rounded-2xl font-bold hover:bg-slate-700 transition-colors"
                  >
                    مسح
                  </button>
                  <button 
                    onClick={() => {
                      alert('عمل رائع! استمر في المحاولة.');
                    }}
                    className="flex-1 bg-orange-500 text-white px-6 py-4 rounded-2xl font-bold hover:bg-orange-600 transition-shadow shadow-lg shadow-orange-900/40"
                  >
                    تحقق
                  </button>
                </div>
                <button 
                  onClick={() => {
                    setPracticeIndex((prev) => (prev + 1) % LESSONS.length);
                    setTimeout(() => clearCanvasRef.current?.(), 50);
                  }}
                  className="w-full bg-slate-800 border-2 border-slate-700 text-orange-300 px-6 py-4 rounded-2xl font-bold hover:bg-slate-700 transition-colors flex items-center justify-center gap-2"
                >
                  الحرف التالي <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lesson Modal */}
      <AnimatePresence>
        {selectedLesson && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-6"
            onClick={() => setSelectedLesson(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-lg rounded-[48px] p-12 shadow-2xl space-y-8 text-center"
              onClick={e => e.stopPropagation()}
            >
              <div className="space-y-2">
                <span className="text-[120px] font-serif text-slate-800 leading-none">{selectedLesson.character}</span>
                <p className="text-2xl font-black text-orange-500 uppercase tracking-[0.2em]">{selectedLesson.pinyin}</p>
              </div>
              
              <div className="space-y-4 py-6 border-y border-orange-50">
                <p className="text-4xl font-black text-slate-700" dir="rtl">{selectedLesson.arabic}</p>
                <p className="text-slate-500 font-medium italic">{selectedLesson.example}</p>
              </div>

              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => speak(selectedLesson.character)}
                  className="w-full bg-orange-500 text-white py-4 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-orange-600 transition-colors"
                >
                  <Volume2 size={20} /> استمع للنطق
                </button>
                <button 
                  onClick={() => setSelectedLesson(null)}
                  className="w-full bg-slate-50 text-slate-500 py-4 rounded-2xl font-bold hover:bg-slate-100 transition-colors"
                >
                  إغلاق
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="p-12 text-center text-slate-400 text-sm font-medium">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Heart size={14} className="text-red-400 fill-red-400" />
          <span>صنع بكل حب لميرا</span>
        </div>
        <p>© 2026 Mira Learn Chinese • بدون طشة ثومه</p>
      </footer>
    </div>
  );
}

interface MenuButtonProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  color: string;
  onClick: () => void;
}

const MenuButton: React.FC<MenuButtonProps> = ({ icon, title, subtitle, color, onClick }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05, y: -8 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={cn(
        "p-8 rounded-[40px] flex flex-col items-center gap-4 transition-all shadow-sm hover:shadow-xl border-2 border-white",
        color
      )}
    >
      <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center shadow-sm">
        {React.cloneElement(icon as React.ReactElement, { size: 32 })}
      </div>
      <div className="text-center">
        <h3 className="text-2xl font-black text-slate-700">{title}</h3>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{subtitle}</p>
      </div>
    </motion.button>
  );
}
