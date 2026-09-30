import math
import random
import os
from PIL import Image, ImageDraw, ImageFilter

ASSETS_DIR = 'public/assets/presentation'
os.makedirs(ASSETS_DIR, exist_ok=True)

def create_google_maps_grounding_hd(filename, width=1920, height=1080):
    img = Image.new('RGB', (width, height), (6, 15, 30))
    draw = ImageDraw.Draw(img)
    
    # Road network grid
    random.seed(42)
    for x in range(0, width, 60):
        c = (18, 32, 60) if x % 180 != 0 else (30, 50, 90)
        draw.line([(x, 0), (x, height)], fill=c, width=1 if x % 180 != 0 else 2)
    for y in range(0, height, 60):
        c = (18, 32, 60) if y % 180 != 0 else (30, 50, 90)
        draw.line([(0, y), (width, y)], fill=c, width=1 if y % 180 != 0 else 2)
        
    # River Kathajodi curving across map
    river = []
    for step in range(60):
        rx = int(width * (step / 59.0))
        ry = 650 + int(90 * math.sin(step * 0.12))
        river.append((rx, ry))
    draw.line(river, fill=(14, 116, 144), width=36)
    
    # Submerged causeway (Red zone)
    draw.line(river[25:35], fill=(239, 68, 68), width=38)
    
    # Elevated Safe Highway Corridor (Bright Emerald)
    hwy = [(80, 280), (450, 320), (950, 310), (1450, 260), (1850, 220)]
    draw.line(hwy, fill=(16, 185, 129), width=8)
    
    img = img.filter(ImageFilter.GaussianBlur(radius=2))
    draw2 = ImageDraw.Draw(img)
    
    # Google Maps styled pins
    pins = [
        ("SCB Medical College ICU", 920, 270, (239, 68, 68), "GROUNDED: 100% Capacity • DG Power OK"),
        ("OSDMA Cyclone Shelter #4", 420, 290, (16, 185, 129), "GROUNDED: Capacity 2,500 • High Ground"),
        ("Madhusudan Causeway Link", 820, 670, (239, 68, 68), "EXCLUDED: Submerged 0.85m Water"),
        ("Ravenshaw Elevated Haven", 1380, 240, (16, 185, 129), "GROUNDED: Certified Safe Zone")
    ]
    for pname, px, py, pcol, psub in pins:
        draw2.ellipse([px - 14, py - 14, px + 14, py + 14], fill=pcol, outline=(255, 255, 255), width=3)
        draw2.rectangle([px + 20, py - 18, px + 440, py + 22], fill=(3, 7, 18), outline=pcol, width=1)
        draw2.text((px + 28, py - 14), pname, fill=(255, 255, 255))
        draw2.text((px + 28, py + 2), psub, fill=(148, 163, 184))
        
    img.save(filename, format='PNG', compress_level=1)
    print(f"Created Google Maps grounding HD: {filename}")

def create_hydrodynamic_physics_hd(filename, width=1920, height=1080):
    img = Image.new('RGB', (width, height), (4, 10, 26))
    draw = ImageDraw.Draw(img)
    
    # Left: Channel velocity gradient (Manning's Equation)
    cx0, cy0, cx1, cy1 = 80, 100, 900, 980
    draw.rectangle([cx0, cy0, cx1, cy1], fill=(8, 18, 38), outline=(30, 58, 138), width=2)
    
    # Draw trapezoidal channel cross-section
    trap = [(cx0 + 80, cy0 + 200), (cx0 + 220, cy1 - 120), (cx1 - 220, cy1 - 120), (cx1 - 80, cy0 + 200)]
    draw.line(trap, fill=(100, 116, 139), width=4)
    
    # Water layers with velocity vectors
    water_poly = [(cx0 + 120, cy0 + 320), (cx0 + 220, cy1 - 120), (cx1 - 220, cy1 - 120), (cx1 - 120, cy0 + 320)]
    draw.polygon(water_poly, fill=(14, 80, 130))
    
    # Velocity streamlines (Parabolic flow)
    for y in range(cy0 + 360, cy1 - 140, 45):
        norm = 1.0 - (y - (cy0 + 360)) / float(cy1 - 140 - (cy0 + 360))
        arrow_len = int(140 + 260 * math.sqrt(norm))
        x_start = cx0 + 260
        draw.line([(x_start, y), (x_start + arrow_len, y)], fill=(56, 189, 248), width=3)
        draw.polygon([(x_start + arrow_len, y - 6), (x_start + arrow_len + 12, y), (x_start + arrow_len, y + 6)], fill=(56, 189, 248))
        
    # Right: Temporal anti-leakage cryptographic ledger
    lx0, ly0, lx1, ly1 = 980, 100, width - 80, 980
    draw.rectangle([lx0, ly0, lx1, ly1], fill=(8, 18, 38), outline=(30, 58, 138), width=2)
    
    blocks = [
        ("T - 24h : BASELINE SENSOR AUDIT", "HASH: 9f8a3c...d84e", (52, 211, 153), "VALIDATED: No future state accessible"),
        ("T - 12h : IMD RADAR CLOUDBURST INGESTION", "HASH: e47b11...982a", (56, 189, 248), "PARTITION: t <= T_eval invariant enforced"),
        ("T - 6h : JOBRA BARRAGE BREACH THRESHOLD", "HASH: 3c59de...a710", (245, 158, 11), "STRICT ENVELOPE: Future hydrographs blocked"),
        ("T - 0h : LANDFALL CASUALTY AVOIDANCE", "HASH: 8b021a...ff34", (168, 85, 247), "EXECUTION: Statutory precedence compliant")
    ]
    for idx, (btitle, bhash, bcol, bstatus) in enumerate(blocks):
        by = ly0 + 80 + idx * 190
        draw.rectangle([lx0 + 50, by, lx1 - 50, by + 120], fill=(15, 23, 42), outline=bcol, width=2)
        draw.text((lx0 + 80, by + 20), btitle, fill=(255, 255, 255))
        draw.text((lx0 + 80, by + 52), bhash, fill=bcol)
        draw.text((lx0 + 80, by + 82), bstatus, fill=(148, 163, 184))
        if idx < 3:
            draw.line([(lx0 + (lx1 - lx0) // 2, by + 120), (lx0 + (lx1 - lx0) // 2, by + 190)], fill=(56, 189, 248), width=3)
            
    img = img.filter(ImageFilter.GaussianBlur(radius=2))
    img.save(filename, format='PNG', compress_level=1)
    print(f"Created hydrodynamic physics HD: {filename}")

def create_translation_gap_infographic_hd(filename, width=1920, height=1080):
    img = Image.new('RGB', (width, height), (5, 12, 26))
    draw = ImageDraw.Draw(img)
    
    mid_x = width // 2
    # Left: The Broken Status Quo (Red)
    draw.rectangle([60, 60, mid_x - 30, height - 60], fill=(22, 10, 16), outline=(239, 68, 68), width=3)
    draw.text((100, 100), "STATUS QUO: FRAGMENTED DATA SILOS & FATAL DELAY", fill=(239, 68, 68))
    
    # Silo cards
    silos = [
        ("CWC Hydrology PDF Bulletin", "4-6 Hour Ingestion Lag", "Raw RL 21.65m (Incomprehensible to public)"),
        ("IMD Doppler Weather Radar", "Isolated Meteorologist Portal", "dBZ Reflectivity unmapped to street flooding"),
        ("INCOIS Marine Ocean Gauge", "Separate Port Authority Feed", "+2.3m Tide uncoupled from river backwater"),
        ("Citizen Ground Reality", "ZERO Timely Notification", "Evacuation delayed until floodwater enters homes")
    ]
    for i, (title, tag, desc) in enumerate(silos):
        sy = 180 + i * 180
        draw.rectangle([100, sy, mid_x - 70, sy + 140], fill=(30, 15, 22), outline=(150, 40, 50), width=1)
        draw.text((130, sy + 24), title, fill=(255, 255, 255))
        draw.text((130, sy + 62), tag, fill=(239, 68, 68))
        draw.text((130, sy + 94), desc, fill=(180, 190, 205))
        
    # Right: GeoShield Unified Solution (Emerald & Cyan)
    draw.rectangle([mid_x + 30, 60, width - 60, height - 60], fill=(8, 24, 32), outline=(16, 185, 129), width=3)
    draw.text((mid_x + 70, 100), "GEOSHIELD: REAL-TIME MULTI-AGENCY DETERMINISTIC SYNTHESIS", fill=(52, 211, 153))
    
    sol_items = [
        ("Sub-120ms Ingestion Bus", "Instantaneous Multi-Source Fusion", "CWC + IMD + INCOIS + ESA unified in real-time"),
        ("Deterministic Physics Core", "Manning's Equation & Estuary Profile", "Exact street-level flood depth (0.45m - 1.20m)"),
        ("Lifeline Cascades Engine", "Digital Twin Interdependency Graph", "Pre-empts substation, water plant & ICU failures"),
        ("Citizen Multilingual Voice/SMS", "Odia • Hindi • English • Bengali", "Clear actionable life-saving instructions in seconds")
    ]
    for i, (title, tag, desc) in enumerate(sol_items):
        sy = 180 + i * 180
        draw.rectangle([mid_x + 70, sy, width - 100, sy + 140], fill=(12, 38, 48), outline=(20, 110, 110), width=1)
        draw.text((mid_x + 100, sy + 24), title, fill=(255, 255, 255))
        draw.text((mid_x + 100, sy + 62), tag, fill=(52, 211, 153))
        draw.text((mid_x + 100, sy + 94), desc, fill=(200, 220, 235))
        
    img = img.filter(ImageFilter.GaussianBlur(radius=2))
    img.save(filename, format='PNG', compress_level=1)
    print(f"Created translation gap infographic HD: {filename}")

def create_national_mission_roadmap_hd(filename, width=1920, height=1080):
    img = Image.new('RGB', (width, height), (3, 8, 24))
    draw = ImageDraw.Draw(img)
    
    # Indian Peninsula outline schematic
    pts = [
        (480, 220), (960, 120), (1420, 220),
        (1340, 520), (1120, 840), (960, 960),
        (800, 840), (580, 520)
    ]
    draw.polygon(pts, fill=(10, 25, 50))
    draw.line(pts + [pts[0]], fill=(30, 64, 120), width=3)
    
    # Coastal Shield Defense Arc (Bay of Bengal & Arabian Sea)
    coastal_arc = [
        (580, 520), (680, 680), (800, 840), (960, 960), (1120, 840), (1240, 680), (1340, 520)
    ]
    draw.line(coastal_arc, fill=(56, 189, 248), width=6)
    
    # Pulsing Defense Hubs
    hubs = [
        ("Odisha SEOC (Paradip / Cuttack)", 1280, 540, (239, 68, 68), "PHASE 1: LIVE PILOT"),
        ("Tamil Nadu TNSDMA (Chennai)", 1160, 780, (245, 158, 11), "PHASE 2: PILOT EXPANSION"),
        ("Andhra Pradesh APDMA (Visakhapatnam)", 1240, 640, (245, 158, 11), "PHASE 2: EXPANSION"),
        ("West Bengal WBDMA (Kolkata)", 1340, 440, (245, 158, 11), "PHASE 2: EXPANSION"),
        ("Gujarat GSDMA (Kandla / Surat)", 540, 480, (168, 85, 247), "PHASE 3: NATIONAL MESH")
    ]
    for hname, hx, hy, hcol, hphase in hubs:
        draw.ellipse([hx - 16, hy - 16, hx + 16, hy + 16], fill=hcol, outline=(255, 255, 255), width=3)
        draw.ellipse([hx - 36, hy - 36, hx + 36, hy + 36], outline=hcol, width=1)
        draw.rectangle([hx + 30, hy - 20, hx + 460, hy + 24], fill=(3, 7, 18), outline=hcol, width=1)
        draw.text((hx + 40, hy - 14), hname, fill=(255, 255, 255))
        draw.text((hx + 40, hy + 4), hphase, fill=hcol)
        
    img = img.filter(ImageFilter.GaussianBlur(radius=2))
    img.save(filename, format='PNG', compress_level=1)
    print(f"Created national mission roadmap HD: {filename}")

if __name__ == '__main__':
    create_google_maps_grounding_hd(os.path.join(ASSETS_DIR, 'google_maps_grounding_hd.png'))
    create_hydrodynamic_physics_hd(os.path.join(ASSETS_DIR, 'hydrodynamic_physics_hd.png'))
    create_translation_gap_infographic_hd(os.path.join(ASSETS_DIR, 'translation_gap_infographic_hd.png'))
    create_national_mission_roadmap_hd(os.path.join(ASSETS_DIR, 'national_mission_roadmap_hd.png'))
