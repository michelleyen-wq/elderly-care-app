import React, { useState } from 'react';
import { Utensils, Volume2, Clock, Leaf, Camera, Calendar, X, Image as ImageIcon, Trash2 } from 'lucide-react';
import { tts } from '../services/ttsService';

export default function RecipesView({ lang, t }) {
  const [activeTab, setActiveTab] = useState('veg'); // 'veg' or 'nonveg'
  const [selectedDay, setSelectedDay] = useState('Mon'); // 'Mon' - 'Sun'
  const [fullscreenImage, setFullscreenImage] = useState(null);

  const daysList = [
    { key: 'Mon', labelZh: '週一', labelEn: 'Mon' },
    { key: 'Tue', labelZh: '週二', labelEn: 'Tue' },
    { key: 'Wed', labelZh: '週三', labelEn: 'Wed' },
    { key: 'Thu', labelZh: '週四', labelEn: 'Thu' },
    { key: 'Fri', labelZh: '週五', labelEn: 'Fri' },
    { key: 'Sat', labelZh: '週六', labelEn: 'Sat' },
    { key: 'Sun', labelZh: '週日', labelEn: 'Sun' }
  ];

  // Recipes Dataset with Delete & Dish Photo Upload Support
  const [recipesVegMap, setRecipesVegMap] = useState({
    Mon: [
      {
        id: 'v1',
        titleZh: '淮山杞子蒸南瓜豆腐',
        titleEn: 'Steamed Tofu with Pumpkin & Chinese Yam',
        prepTime: '20 mins',
        tagZh: '高鈣高纖 • 易咀嚼消化',
        tagEn: 'High Calcium • Easy to Chew',
        calories: '180 kcal',
        protein: '12g',
        fiber: '4.5g',
        photoUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
        ingredientsZh: ['有機嫩豆腐 1盒', '南瓜 150g (切薄片)', '鮮淮山 50g', '枸杞 10顆'],
        ingredientsEn: ['Soft Tofu 1 box', 'Pumpkin 150g', 'Fresh Yam 50g', 'Goji berries 10'],
        stepsZh: ['1. 將南瓜與鮮淮山蒸軟壓成泥。', '2. 嫩豆腐切厚塊鋪底，鋪上南瓜泥大火蒸 8 分鐘。', '3. 撒上枸杞與淡鹽醬油。'],
        stepsEn: ['1. Steam and mash pumpkin and yam.', '2. Slice tofu, add mash, steam for 8 mins.', '3. Season lightly.']
      }
    ],
    Tue: [
      {
        id: 'v2',
        titleZh: '菠菜山藥燕麥養生濃湯',
        titleEn: 'Spinach & Yam Oats Wellness Soup',
        prepTime: '15 mins',
        tagZh: '潤腸通便 • 補鐵安神',
        tagEn: 'Bowel Care • Rich in Iron',
        calories: '210 kcal',
        protein: '9g',
        fiber: '6.0g',
        photoUrl: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80',
        ingredientsZh: ['嫩菠菜 100g (切碎)', '細燕麥片 3大匙', '山藥泥 60g', '無糖豆漿 250ml'],
        ingredientsEn: ['Baby Spinach 100g', 'Fine Oats 3 tbsp', 'Yam Puree 60g', 'Soy Milk 250ml'],
        stepsZh: ['1. 豆漿加熱滾後倒入燕麥片小火煮 3 分鐘。', '2. 加入山藥泥與菠菜碎。', '3. 煮軟後加微量鹽。'],
        stepsEn: ['1. Heat soy milk, add oats, cook 3 mins.', '2. Stir in yam and spinach.', '3. Simmer until soft.']
      }
    ],
    Wed: [
      {
        id: 'v3',
        titleZh: '金沙香芋百合煲',
        titleEn: 'Taro & Lily Bulb Claypot Stew',
        prepTime: '22 mins',
        tagZh: '滋陰潤肺 • 鬆軟好入味',
        tagEn: 'Nourishing • Ultra Soft',
        calories: '195 kcal',
        protein: '8g',
        fiber: '5.2g',
        photoUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
        ingredientsZh: ['鬆軟芋頭 150g', '鮮百合 30g', '枸杞 少許', '素高湯 200ml'],
        ingredientsEn: ['Taro 150g', 'Fresh Lily Bulb 30g', 'Goji Berries', 'Veg Stock 200ml'],
        stepsZh: ['1. 芋頭切小丁蒸至鬆軟。', '2. 與百合一同入煲，倒入素高湯小火燉 10 分鐘。'],
        stepsEn: ['1. Steam taro until tender.', '2. Simmer with lily bulb in veg stock for 10 mins.']
      }
    ],
    Thu: [
      {
        id: 'v4',
        titleZh: '番茄豆腐野菇軟煲',
        titleEn: 'Tomato Tofu & Mushroom Stew',
        prepTime: '18 mins',
        tagZh: '豐富茄紅素 • 促進食慾',
        tagEn: 'Lycopene Rich • Appetizing',
        calories: '175 kcal',
        protein: '11g',
        fiber: '4.8g',
        photoUrl: 'https://images.unsplash.com/photo-1582169505937-b9992bd01ed9?auto=format&fit=crop&w=800&q=80',
        ingredientsZh: ['熟番茄 2顆', '板豆腐 1塊', '鴻喜菇 50g'],
        ingredientsEn: ['Ripe Tomatoes 2', 'Tofu 1 block', 'Shimeji Mushroom 50g'],
        stepsZh: ['1. 番茄炒出濃汁。', '2. 加入豆腐與菇類燉煮軟爛。'],
        stepsEn: ['1. Saute tomato until soft.', '2. Add tofu and mushroom, stew until tender.']
      }
    ],
    Fri: [
      {
        id: 'v5',
        titleZh: '銀耳蓮子大棗甜羹',
        titleEn: 'Snow Fungus & Lotus Seed Soup',
        prepTime: '30 mins',
        tagZh: '膠原潤燥 • 養顏助眠',
        tagEn: 'Collagen Rich • Sleep Support',
        calories: '160 kcal',
        protein: '5g',
        fiber: '5.5g',
        photoUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
        ingredientsZh: ['泡發白木耳 100g', '去芯蓮子 30g', '紅棗 3顆'],
        ingredientsEn: ['Snow Fungus 100g', 'Lotus Seed 30g', 'Red Dates 3'],
        stepsZh: ['1. 白木耳切碎，與蓮子紅棗入鍋熬煮至膠質黏稠。'],
        stepsEn: ['1. Simmer snow fungus and lotus seeds until thick.']
      }
    ],
    Sat: [
      {
        id: 'v6',
        titleZh: '翡翠胡蘿蔔馬鈴薯泥',
        titleEn: 'Mashed Potato & Carrot Puree',
        prepTime: '15 mins',
        tagZh: '維生素A • 護眼好消化',
        tagEn: 'Vitamin A • Eye Health',
        calories: '200 kcal',
        protein: '6g',
        fiber: '4.0g',
        photoUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80',
        ingredientsZh: ['馬鈴薯 1顆', '胡蘿蔔 50g', '鮮奶 50ml'],
        ingredientsEn: ['Potato 1', 'Carrot 50g', 'Fresh Milk 50ml'],
        stepsZh: ['1. 食材切塊蒸熟，加入鮮奶打成綿密純泥。'],
        stepsEn: ['1. Steam veggies and blend with milk into smooth mash.']
      }
    ],
    Sun: [
      {
        id: 'v7',
        titleZh: '松子彩椒炒百合豆腐',
        titleEn: 'Pine Nut Tofu & Lily Bulb Stir Fry',
        prepTime: '18 mins',
        tagZh: '優質油脂 • 抗氧化健腦',
        tagEn: 'Healthy Fats • Brain Health',
        calories: '220 kcal',
        protein: '13g',
        fiber: '3.8g',
        photoUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
        ingredientsZh: ['松子 10g', '彩椒碎 30g', '鮮百合 20g', '嫩豆腐 150g'],
        ingredientsEn: ['Pine Nuts 10g', 'Diced Bell Pepper 30g', 'Lily Bulb 20g', 'Soft Tofu 150g'],
        stepsZh: ['1. 豆腐切丁輕煎，加入百合彩椒快速拌炒。'],
        stepsEn: ['1. Lightly saute tofu, stir in lily bulb and pepper.']
      }
    ]
  });

  const [recipesNonVegMap, setRecipesNonVegMap] = useState({
    Mon: [
      {
        id: 'nv1',
        titleZh: '鱸魚豆腐枸杞補氣湯',
        titleEn: 'Steamed Sea Bass & Tofu Tonic Soup',
        prepTime: '25 mins',
        tagZh: '優質蛋白 • 促進組織修復',
        tagEn: 'High Quality Protein • Fast Recovery',
        calories: '260 kcal',
        protein: '28g',
        fiber: '1.2g',
        photoUrl: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=80',
        ingredientsZh: ['新鮮鱸魚菲力 150g (去刺)', '板豆腐 100g', '薑絲 少許'],
        ingredientsEn: ['Fresh Sea Bass Fillet 150g', 'Firm Tofu 100g', 'Ginger'],
        stepsZh: ['1. 魚菲力切小塊與豆腐蒸 15 分鐘。', '2. 滴入橄欖油享用鮮美純湯。'],
        stepsEn: ['1. Steam boneless fish with tofu 15 mins.', '2. Drizzle olive oil.']
      }
    ],
    Tue: [
      {
        id: 'nv2',
        titleZh: '鮮茄軟爛細絞肉蒸蛋',
        titleEn: 'Soft Tomato Ground Meat Egg Custard',
        prepTime: '20 mins',
        tagZh: '開胃下飯 • 滑嫩好吞嚥',
        tagEn: 'Appetizing • Ultra Smooth Custard',
        calories: '240 kcal',
        protein: '18g',
        fiber: '2.5g',
        photoUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80',
        ingredientsZh: ['新鮮雞蛋 2顆', '細豬絞肉 50g', '番茄泥 2大匙'],
        ingredientsEn: ['Eggs 2', 'Finely Ground Pork 50g', 'Tomato Puree 2 tbsp'],
        stepsZh: ['1. 雞蛋加水過篩蒸 10 分鐘。', '2. 鋪上炒香番茄絞肉醬。'],
        stepsEn: ['1. Steam egg mix for 10 mins.', '2. Top with warm tomato pork sauce.']
      }
    ],
    Wed: [
      {
        id: 'nv3',
        titleZh: '清燉軟嫩牛肉蘿蔔湯',
        titleEn: 'Tender Beef & White Radish Stew',
        prepTime: '35 mins',
        tagZh: '補鐵補氣 • 肉質酥爛',
        tagEn: 'Iron Rich • Ultra Tender Beef',
        calories: '280 kcal',
        protein: '25g',
        fiber: '2.0g',
        photoUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
        ingredientsZh: ['牛腩條 120g (燉爛)', '白蘿蔔 100g', '蔥段 少許'],
        ingredientsEn: ['Beef Brisket 120g', 'White Radish 100g', 'Scallions'],
        stepsZh: ['1. 牛肉蘿蔔慢火燉煮 30 分鐘至入口即化。'],
        stepsEn: ['1. Slow stew beef and radish for 30 mins.']
      }
    ],
    Thu: [
      {
        id: 'nv4',
        titleZh: '香菇雞絲滑蛋粥',
        titleEn: 'Chicken & Mushroom Egg Congee',
        prepTime: '20 mins',
        tagZh: '暖胃健脾 • 軟綿好消化',
        tagEn: 'Stomach Soothing • Soft Congee',
        calories: '230 kcal',
        protein: '20g',
        fiber: '1.8g',
        photoUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80',
        ingredientsZh: ['雞胸肉絲 80g', '香菇絲 20g', '白粥 1碗', '蛋花 1顆'],
        ingredientsEn: ['Chicken Shreds 80g', 'Shiitake Mushroom', 'Rice Congee 1 bowl', 'Whisked Egg 1'],
        stepsZh: ['1. 白粥沸騰後加入雞絲香菇。', '2. 淋入蛋花攪拌均勻。'],
        stepsEn: ['1. Cook chicken and mushroom in congee.', '2. Swirl in egg.']
      }
    ],
    Fri: [
      {
        id: 'nv5',
        titleZh: '蒜香蒸鮭魚佐綠花椰泥',
        titleEn: 'Garlic Steamed Salmon & Broccoli Puree',
        prepTime: '22 mins',
        tagZh: 'Omega-3 腦健康 • 護心必備',
        tagEn: 'Omega-3 Rich • Heart Protection',
        calories: '290 kcal',
        protein: '26g',
        fiber: '3.0g',
        photoUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=800&q=80',
        ingredientsZh: ['無刺鮭魚排 130g', '綠花椰菜泥 80g', '蒜蓉 1小匙'],
        ingredientsEn: ['Salmon Fillet 130g', 'Broccoli Puree 80g', 'Minced Garlic 1 tsp'],
        stepsZh: ['1. 鮭魚鋪蒜蓉蒸 12 分鐘。', '2. 搭配綠花椰菜泥食用。'],
        stepsEn: ['1. Steam salmon with garlic for 12 mins.', '2. Serve with broccoli puree.']
      }
    ],
    Sat: [
      {
        id: 'nv6',
        titleZh: '絲瓜蝦仁蒸豆腐煲',
        titleEn: 'Luffa & Shrimp Steamed Tofu',
        prepTime: '18 mins',
        tagZh: '清熱高纖 • 鮮甜滑口',
        tagEn: 'High Fiber • Fresh & Sweet',
        calories: '210 kcal',
        protein: '22g',
        fiber: '2.8g',
        photoUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80',
        ingredientsZh: ['新鮮蝦仁 80g (剁泥)', '絲瓜片 100g', '嫩豆腐 1塊'],
        ingredientsEn: ['Shrimp Paste 80g', 'Luffa Slices 100g', 'Tofu 1 block'],
        stepsZh: ['1. 蝦泥釀於豆腐上，與絲瓜一同蒸 10 分鐘。'],
        stepsEn: ['1. Top tofu with shrimp paste, steam with luffa for 10 mins.']
      }
    ],
    Sun: [
      {
        id: 'nv7',
        titleZh: '南瓜燉細切豬軟骨湯',
        titleEn: 'Pumpkin Stewed Pork Soft Ribs',
        prepTime: '30 mins',
        tagZh: '天然膠原軟骨 • 補充膝蓋活力',
        tagEn: 'Collagen & Cartilage • Joint Care',
        calories: '270 kcal',
        protein: '24g',
        fiber: '3.5g',
        photoUrl: 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&w=800&q=80',
        ingredientsZh: ['細豬軟骨 100g', '南瓜塊 120g', '紅棗 2顆'],
        ingredientsEn: ['Pork Soft Ribs 100g', 'Pumpkin 120g', 'Red Dates 2'],
        stepsZh: ['1. 軟骨與南瓜燉至酥爛即可享受天然膠質。'],
        stepsEn: ['1. Stew soft ribs and pumpkin until tender.']
      }
    ]
  });

  const currentRecipes = (activeTab === 'veg' ? recipesVegMap : recipesNonVegMap)[selectedDay] || [];

  const handleDeleteRecipe = (recipeId, e) => {
    e.stopPropagation();
    const updateMap = activeTab === 'veg' ? setRecipesVegMap : setRecipesNonVegMap;
    const itemToDelete = currentRecipes.find(r => r.id === recipeId);

    updateMap(prevMap => {
      const updatedList = (prevMap[selectedDay] || []).filter(r => r.id !== recipeId);
      return { ...prevMap, [selectedDay]: updatedList };
    });

    tts.playChime('notification');
    const title = itemToDelete ? (lang === 'zh' ? itemToDelete.titleZh : itemToDelete.titleEn) : '';
    tts.speak((lang === 'zh' ? '已刪除食譜：' : 'Deleted recipe: ') + title, lang);
  };

  const handlePhotoUploadForRecipe = (recipeId, e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);

    const updateMap = activeTab === 'veg' ? setRecipesVegMap : setRecipesNonVegMap;
    updateMap(prevMap => {
      const updatedDayList = (prevMap[selectedDay] || []).map(r => r.id === recipeId ? { ...r, photoUrl: url } : r);
      return { ...prevMap, [selectedDay]: updatedDayList };
    });

    tts.playChime('success');
    tts.speak(t.photoSavedSuccess, lang);
  };

  const speakRecipe = (r) => {
    const title = lang === 'zh' ? r.titleZh : r.titleEn;
    const steps = lang === 'zh' ? r.stepsZh.join(' ') : r.stepsEn.join(' ');
    tts.speak(`${title}。${t.steps}：${steps}`, lang);
  };

  return (
    <div className="recipes-view">
      <div className="card" style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', borderColor: '#fcd34d' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#92400e', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Utensils size={20} /> {t.recipeTitle}
        </h3>
        <p style={{ fontSize: '13px', color: '#b45309', marginTop: '2px' }}>{t.recipeSubtitle}</p>
      </div>

      {/* Veg & Non-Veg Split Tabs */}
      <div className="veg-tab-container">
        <button 
          className={`veg-tab ${activeTab === 'veg' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('veg');
            tts.speak(lang === 'zh' ? '已切換至養生素食食譜' : 'Switched to Vegetarian recipes', lang);
          }}
        >
          {t.tabVeg}
        </button>
        <button 
          className={`veg-tab ${activeTab === 'nonveg' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('nonveg');
            tts.speak(lang === 'zh' ? '已切換至營養葷食食譜' : 'Switched to Non-Vegetarian recipes', lang);
          }}
        >
          {t.tabNonVeg}
        </button>
      </div>

      {/* Day of Week Selector Bar */}
      <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '8px', marginBottom: '14px' }}>
        {daysList.map(d => (
          <button
            key={d.key}
            onClick={() => setSelectedDay(d.key)}
            style={{
              padding: '6px 14px',
              borderRadius: '16px',
              border: 'none',
              fontSize: '13px',
              fontWeight: '800',
              whiteSpace: 'nowrap',
              background: selectedDay === d.key ? '#f59e0b' : 'white',
              color: selectedDay === d.key ? 'white' : 'var(--text-muted)',
              boxShadow: 'var(--shadow-sm)',
              cursor: 'pointer'
            }}
          >
            {lang === 'zh' ? d.labelZh : d.labelEn}
          </button>
        ))}
      </div>

      {/* Recipe Cards List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {currentRecipes.map(r => (
          <div key={r.id} className="card" style={{ padding: '0', overflow: 'hidden' }}>
            {/* Dish Photo Banner */}
            {r.photoUrl && (
              <div 
                style={{ position: 'relative', width: '100%', height: '170px', cursor: 'pointer', background: '#000' }}
                onClick={() => setFullscreenImage(r.photoUrl)}
              >
                <img src={r.photoUrl} alt={r.titleZh} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', bottom: '8px', right: '8px', background: 'rgba(0,0,0,0.7)', color: 'white', padding: '3px 8px', borderRadius: '8px', fontSize: '11px', fontWeight: '700', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <ImageIcon size={12} /> 點擊放大相片
                </div>
              </div>
            )}

            <div style={{ padding: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <div>
                  <h4 style={{ fontSize: '17px', fontWeight: '800', color: 'var(--text-main)' }}>
                    {lang === 'zh' ? r.titleZh : r.titleEn}
                  </h4>
                  <span style={{ 
                    display: 'inline-block', 
                    fontSize: '12px', 
                    fontWeight: '700', 
                    color: activeTab === 'veg' ? '#047857' : '#b91c1c', 
                    background: activeTab === 'veg' ? '#d1fae5' : '#fee2e2', 
                    padding: '2px 8px', 
                    borderRadius: '8px', 
                    marginTop: '4px' 
                  }}>
                    {lang === 'zh' ? r.tagZh : r.tagEn}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                  <label 
                    style={{ background: '#f59e0b', color: 'white', border: 'none', padding: '6px 10px', borderRadius: '10px', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px' }}
                    title={t.uploadDishPhoto}
                  >
                    <Camera size={14} /> 拍照存證
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={(e) => handlePhotoUploadForRecipe(r.id, e)} 
                      style={{ display: 'none' }} 
                    />
                  </label>

                  <button 
                    onClick={() => speakRecipe(r)}
                    style={{ background: 'var(--primary-light)', color: 'var(--primary)', border: 'none', padding: '6px 10px', borderRadius: '10px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px' }}
                  >
                    <Volume2 size={16} /> 朗讀
                  </button>

                  <button 
                    onClick={(e) => handleDeleteRecipe(r.id, e)}
                    style={{ background: '#fee2e2', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '6px', borderRadius: '8px' }}
                    title="刪除食譜"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Metrics */}
              <div style={{ display: 'flex', gap: '12px', background: '#f8fafc', padding: '8px 12px', borderRadius: '12px', margin: '12px 0', fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)' }}>
                <span>🔥 {t.calories}: {r.calories}</span>
                <span>💪 {t.protein}: {r.protein}</span>
                <span>🌾 {t.fiber}: {r.fiber}</span>
                <span style={{ marginLeft: 'auto' }}>⏱️ {r.prepTime}</span>
              </div>

              {/* Ingredients */}
              <div style={{ marginBottom: '10px' }}>
                <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '4px' }}>
                  🛒 {t.ingredients}
                </div>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                  {(lang === 'zh' ? r.ingredientsZh : r.ingredientsEn).join(' • ')}
                </p>
              </div>

              {/* Steps */}
              <div>
                <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '4px' }}>
                  🍳 {t.steps}
                </div>
                <ol style={{ paddingLeft: '16px', fontSize: '13px', color: 'var(--text-main)', lineHeight: '1.5' }}>
                  {(lang === 'zh' ? r.stepsZh : r.stepsEn).map((step, idx) => (
                    <li key={idx} style={{ marginBottom: '4px' }}>{step}</li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Fullscreen Photo Modal */}
      {fullscreenImage && (
        <div className="modal-overlay" onClick={() => setFullscreenImage(null)}>
          <div className="modal-card" style={{ background: '#000', color: 'white', textAlign: 'center' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
              <button onClick={() => setFullscreenImage(null)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
                <X size={24} />
              </button>
            </div>
            <img src={fullscreenImage} alt="Food photo" style={{ width: '100%', borderRadius: '12px', maxHeight: '70vh', objectFit: 'contain' }} />
          </div>
        </div>
      )}
    </div>
  );
}
