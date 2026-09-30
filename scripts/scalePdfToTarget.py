import math
import random
import os
import subprocess
from PIL import Image, ImageDraw, ImageFilter

ASSETS_DIR = 'public/assets/presentation'
os.makedirs(ASSETS_DIR, exist_ok=True)

def generate_textured_planetary_earth(width=2560, height=1440):
    img = Image.new('RGB', (width, height), (2, 6, 20))
    draw = ImageDraw.Draw(img)
    
    # Starfield background texture
    random.seed(999)
    for _ in range(4000):
        sx = random.randint(0, width - 1)
        sy = random.randint(0, height - 1)
        brightness = random.randint(140, 255)
        col = (brightness, brightness, int(brightness * 0.95))
        draw.point((sx, sy), fill=col)
        
    cx, cy = int(width * 0.65), int(height * 0.50)
    r = int(height * 0.42)
    
    # Multi-layer atmospheric glow
    for dr in range(160, 0, -3):
        alpha = int(40 * (1.0 - dr / 160.0))
        draw.ellipse([cx - r - dr, cy - r - dr, cx + r + dr, cy + r + dr], outline=(30 + alpha, 100 + alpha, 200 + alpha), width=2)
        
    # Base Earth sphere with deep ocean shading
    for step in range(r, 0, -10):
        ratio = step / float(r)
        c = (int(4 + 10 * (1 - ratio)), int(16 + 32 * (1 - ratio)), int(38 + 60 * (1 - ratio)))
        draw.ellipse([cx - step, cy - step, cx + step, cy + step], fill=c)
        
    # Longitude & Latitude spherical wireframe
    for lat_deg in range(-75, 85, 12):
        y_pos = int(r * math.sin(math.radians(lat_deg)))
        semi_w = int(r * math.cos(math.radians(lat_deg)))
        if semi_w > 0:
            draw.ellipse([cx - semi_w, cy + y_pos - 12, cx + semi_w, cy + y_pos + 12], outline=(28, 64, 130), width=2)
            
    for lng_deg in range(-85, 90, 12):
        x_pos = int(r * math.sin(math.radians(lng_deg)))
        semi_h = int(r * math.cos(math.radians(lng_deg)))
        if semi_h > 0:
            draw.ellipse([cx + x_pos - 12, cy - semi_h, cx + x_pos + 12, cy + semi_h], outline=(28, 64, 130), width=2)
            
    # Landmass texture with fine fractal variation
    india_points = [
        (cx - 240, cy - 180), (cx - 160, cy - 210), (cx - 80, cy - 190),
        (cx - 25, cy - 100), (cx + 50, cy - 25), (cx + 100, cy + 50),
        (cx + 50, cy + 160), (cx - 25, cy + 290), (cx - 80, cy + 240),
        (cx - 130, cy + 110), (cx - 210, cy + 15), (cx - 250, cy - 90)
    ]
    draw.polygon(india_points, fill=(16, 140, 95))
    draw.line(india_points + [india_points[0]], fill=(52, 211, 153), width=4)
    
    # Dense cyclone spiral cloud bands
    bx, by = cx + 80, cy + 50
    for i in range(400):
        theta = i * 0.08
        dist = 25 + i * 2.2
        px = bx + int(dist * math.cos(theta))
        py = by + int(dist * math.sin(theta))
        rad = int(18 + i * 0.18)
        col = (235, 245, 255)
        draw.ellipse([px - rad, py - rad, px + rad, py + rad], fill=col)
        
    img = img.filter(ImageFilter.GaussianBlur(radius=3))
    out_path = os.path.join(ASSETS_DIR, 'planetary_earth_hd.png')
    img.save(out_path, format='PNG', compress_level=1)
    print(f"Saved: {out_path} ({os.path.getsize(out_path)} bytes)")

def generate_textured_gis_radar(width=2560, height=1440):
    img = Image.new('RGB', (width, height), (3, 7, 18))
    draw = ImageDraw.Draw(img)
    
    # Fine radar noise texture
    random.seed(777)
    for x in range(0, width, 25):
        c = (14, 22, 40) if x % 100 != 0 else (28, 44, 75)
        draw.line([(x, 0), (x, height)], fill=c, width=1)
    for y in range(0, height, 25):
        c = (14, 22, 40) if y % 100 != 0 else (28, 44, 75)
        draw.line([(0, y), (width, y)], fill=c, width=1)
        
    # Coastline contour
    coast_pts = []
    for step in range(120):
        t = step / 119.0
        x = int(width * 0.52) + int(850 * math.sin(t * 2.8)) + int(45 * math.sin(t * 18))
        y = int(height * t)
        coast_pts.append((x, y))
    
    ocean_polygon = [(width, 0), (width, height), (coast_pts[-1][0], height)] + coast_pts[::-1] + [(coast_pts[0][0], 0)]
    draw.polygon(ocean_polygon, fill=(6, 24, 52))
    draw.line(coast_pts, fill=(56, 189, 248), width=4)
    
    # Concentric Doppler radar rings
    rx, ry = int(width * 0.70), int(height * 0.42)
    for r in range(50, 1100, 60):
        draw.ellipse([rx - r, ry - r, rx + r, ry + r], outline=(36, 90, 160), width=1)
        
    # Weather dBZ spiral arms
    for band in range(8):
        for step in range(250):
            theta = step * 0.07 + band * 0.8
            dist = 30 + step * 4.2
            x = rx + int(dist * math.cos(theta))
            y = ry + int(dist * math.sin(theta))
            radius = int(14 + step * 0.28)
            if dist < 220:
                col = (239, 68, 68)
            elif dist < 420:
                col = (245, 158, 11)
            elif dist < 650:
                col = (16, 185, 129)
            else:
                col = (14, 165, 233)
            draw.ellipse([x - radius, y - radius, x + radius, y + radius], fill=col)
            
    img = img.filter(ImageFilter.GaussianBlur(radius=6))
    
    # Sharp telemetry pins
    draw2 = ImageDraw.Draw(img)
    pins = [
        ("Jobra Barrage (21.65m Stage)", int(width * 0.46), int(height * 0.38), (239, 68, 68)),
        ("OPTCL Substation (Grid Tripped)", int(width * 0.65), int(height * 0.40), (245, 158, 11)),
        ("INCOIS Buoy BD12 (+2.3m Surge)", int(width * 0.80), int(height * 0.65), (56, 189, 248)),
        ("OSDMA Emergency Shelter #4", int(width * 0.53), int(height * 0.28), (16, 185, 129))
    ]
    for label, px, py, pcol in pins:
        draw2.ellipse([px - 14, py - 14, px + 14, py + 14], fill=pcol, outline=(255, 255, 255), width=3)
        draw2.ellipse([px - 28, py - 28, px + 28, py + 28], outline=pcol, width=1)
        
    out_path = os.path.join(ASSETS_DIR, 'gis_radar_map_hd.png')
    img.save(out_path, format='PNG', compress_level=1)
    print(f"Saved: {out_path} ({os.path.getsize(out_path)} bytes)")

def generate_textured_flood_hazard(width=2560, height=1440):
    img = Image.new('RGB', (width, height), (3, 8, 22))
    draw = ImageDraw.Draw(img)
    
    # Dense topographic elevation contours
    for r in range(1100, 100, -35):
        pts = []
        for step in range(90):
            th = step / 89.0 * 2 * math.pi
            rad = r + int(50 * math.sin(step * 0.9))
            px = int(width * 0.5) + int(rad * math.cos(th) * 1.4)
            py = int(height * 0.5) + int(rad * math.sin(th) * 0.8)
            pts.append((px, py))
        draw.polygon(pts, fill=(int(6 + (1100 - r) * 0.02), int(14 + (1100 - r) * 0.04), int(30 + (1100 - r) * 0.06)))
        draw.line(pts + [pts[0]], fill=(25, 48, 100), width=1)
        
    # Braided river system
    river1 = []
    river2 = []
    for step in range(100):
        x = int(width * (step / 99.0))
        y1 = int(height * 0.45) + int(140 * math.sin(step * 0.08)) + int(25 * math.cos(step * 0.25))
        y2 = y1 + 160 + int(70 * math.sin(step * 0.1))
        river1.append((x, y1))
        river2.append((x, y2))
    draw.line(river1, fill=(14, 165, 233), width=24)
    draw.line(river2, fill=(14, 165, 233), width=18)
    
    # Inundation polygons
    draw.ellipse([int(width*0.42), int(height*0.38), int(width*0.62), int(height*0.65)], fill=(185, 28, 28))
    draw.ellipse([int(width*0.36), int(height*0.32), int(width*0.68), int(height*0.72)], outline=(245, 158, 11), width=5)
    draw.ellipse([int(width*0.30), int(height*0.26), int(width*0.74), int(height*0.78)], outline=(251, 191, 36), width=3)
    
    # Highway corridor
    hwy = [(200, 300), (700, 350), (1280, 370), (1900, 340), (2360, 280)]
    draw.line(hwy, fill=(16, 185, 129), width=10)
    
    img = img.filter(ImageFilter.GaussianBlur(radius=4))
    out_path = os.path.join(ASSETS_DIR, 'flood_hazard_depth_hd.png')
    img.save(out_path, format='PNG', compress_level=1)
    print(f"Saved: {out_path} ({os.path.getsize(out_path)} bytes)")

def generate_textured_telemetry_grid(width=2560, height=1440):
    img = Image.new('RGB', (width, height), (5, 12, 30))
    draw = ImageDraw.Draw(img)
    
    mid_x, mid_y = width // 2, height // 2
    draw.line([(mid_x, 0), (mid_x, height)], fill=(30, 58, 138), width=4)
    draw.line([(0, mid_y), (width, mid_y)], fill=(30, 58, 138), width=4)
    
    # Q1: Radar
    rx, ry = mid_x // 2, mid_y // 2
    for r in range(40, 480, 40):
        draw.ellipse([rx - r, ry - r, rx + r, ry + r], outline=(30, 64, 110), width=1)
    random.seed(202)
    for i in range(180):
        th = i * 0.12
        dist = 20 + i * 2.8
        px = rx + int(dist * math.cos(th))
        py = ry + int(dist * math.sin(th))
        rad = int(12 + i * 0.22)
        col = (239, 68, 68) if dist < 160 else ((245, 158, 11) if dist < 300 else (16, 185, 129))
        draw.ellipse([px - rad, py - rad, px + rad, py + rad], fill=col)
        
    # Q2: Hydrograph
    gx0, gy0, gx1, gy1 = mid_x + 80, 80, width - 80, mid_y - 80
    draw.line([(gx0, gy1), (gx1, gy1)], fill=(100, 116, 139), width=2)
    draw.line([(gx0, gy0), (gx0, gy1)], fill=(100, 116, 139), width=2)
    danger_y = gy0 + int((gy1 - gy0) * 0.35)
    draw.line([(gx0, danger_y), (gx1, danger_y)], fill=(239, 68, 68), width=2)
    warning_y = gy0 + int((gy1 - gy0) * 0.55)
    draw.line([(gx0, warning_y), (gx1, warning_y)], fill=(245, 158, 11), width=2)
    
    h_pts = []
    num_pts = 80
    for idx in range(num_pts):
        px = gx0 + int((gx1 - gx0) * (idx / (num_pts - 1)))
        norm_t = idx / (num_pts - 1)
        val = math.exp(-((norm_t - 0.70) ** 2) / 0.08)
        py = gy1 - int((gy1 - gy0 - 50) * (0.2 + 0.75 * val))
        h_pts.append((px, py))
    draw.line(h_pts, fill=(56, 189, 248), width=5)
    poly = [(gx0, gy1)] + h_pts + [(gx1, gy1)]
    draw.polygon(poly, fill=(14, 116, 144))
    
    # Q3: SAR
    sx0, sy0, sx1, sy1 = 60, mid_y + 60, mid_x - 60, height - 60
    for y in range(sy0, sy1, 10):
        for x in range(sx0, sx1, 10):
            noise = (int(math.sin(x * 0.04) * math.cos(y * 0.04) * 60) + 120) % 255
            dist_to_center = abs(y - (sy0 + (sy1 - sy0) // 2) - int(math.sin(x * 0.02) * 60))
            if dist_to_center < 45:
                c = (8, 20, 45)
            elif dist_to_center < 90 and random.random() > 0.4:
                c = (30, 80, 110)
            else:
                c = (15 + (noise // 6), 25 + (noise // 5), 45 + (noise // 4))
            draw.rectangle([x, y, x + 10, y + 10], fill=c)
            
    # Q4: Buoy
    bx0, by0, bx1, by1 = mid_x + 60, mid_y + 60, width - 60, height - 60
    for idx, off in enumerate(range(0, by1 - by0, 18)):
        y_line = by0 + off
        wave_pts = []
        for step in range(70):
            wx = bx0 + int((bx1 - bx0) * (step / 69.0))
            wy = y_line + int(14 * math.sin(step * 0.35 + idx * 0.5))
            wave_pts.append((wx, wy))
        draw.line(wave_pts, fill=(14, 116, 144) if idx % 2 == 0 else (6, 78, 120), width=2)
        
    img = img.filter(ImageFilter.GaussianBlur(radius=2))
    out_path = os.path.join(ASSETS_DIR, 'multi_agency_telemetry_grid_hd.png')
    img.save(out_path, format='PNG', compress_level=1)
    print(f"Saved: {out_path} ({os.path.getsize(out_path)} bytes)")

def generate_textured_google_maps_grounding(width=2560, height=1440):
    img = Image.new('RGB', (width, height), (6, 15, 32))
    draw = ImageDraw.Draw(img)
    
    # Dense street and building grid
    random.seed(42)
    for x in range(0, width, 40):
        c = (16, 28, 55) if x % 160 != 0 else (28, 48, 85)
        draw.line([(x, 0), (x, height)], fill=c, width=1 if x % 160 != 0 else 2)
    for y in range(0, height, 40):
        c = (16, 28, 55) if y % 160 != 0 else (28, 48, 85)
        draw.line([(0, y), (width, y)], fill=c, width=1 if y % 160 != 0 else 2)
        
    # River Kathajodi
    river = []
    for step in range(80):
        rx = int(width * (step / 79.0))
        ry = int(height * 0.60) + int(120 * math.sin(step * 0.12))
        river.append((rx, ry))
    draw.line(river, fill=(14, 116, 144), width=48)
    # Submerged causeway zone
    draw.line(river[32:46], fill=(239, 68, 68), width=52)
    
    # Elevated Safe Highway Corridor
    hwy = [(100, 380), (600, 430), (1280, 410), (1950, 350), (2450, 300)]
    draw.line(hwy, fill=(16, 185, 129), width=10)
    
    img = img.filter(ImageFilter.GaussianBlur(radius=2))
    draw2 = ImageDraw.Draw(img)
    
    pins = [
        ("SCB Medical College ICU", int(width * 0.48), int(height * 0.28), (239, 68, 68), "GROUNDED: 100% Capacity • DG Power OK"),
        ("OSDMA Cyclone Shelter #4", int(width * 0.22), int(height * 0.30), (16, 185, 129), "GROUNDED: Capacity 2,500 • Certified High Ground"),
        ("Madhusudan Causeway Link", int(width * 0.43), int(height * 0.62), (239, 68, 68), "EXCLUDED: Submerged 0.85m Water"),
        ("Ravenshaw Elevated Haven", int(width * 0.72), int(height * 0.25), (16, 185, 129), "GROUNDED: Certified Safe Zone")
    ]
    for pname, px, py, pcol, psub in pins:
        draw2.ellipse([px - 18, py - 18, px + 18, py + 18], fill=pcol, outline=(255, 255, 255), width=3)
        draw2.rectangle([px + 26, py - 24, px + 580, py + 28], fill=(3, 7, 18), outline=pcol, width=1)
        draw2.text((px + 36, py - 18), pname, fill=(255, 255, 255))
        draw2.text((px + 36, py + 4), psub, fill=(148, 163, 184))
        
    out_path = os.path.join(ASSETS_DIR, 'google_maps_grounding_hd.png')
    img.save(out_path, format='PNG', compress_level=1)
    print(f"Saved: {out_path} ({os.path.getsize(out_path)} bytes)")

def generate_textured_hydrodynamic_physics(width=2560, height=1440):
    img = Image.new('RGB', (width, height), (4, 10, 28))
    draw = ImageDraw.Draw(img)
    
    cx0, cy0, cx1, cy1 = 100, 140, 1200, 1300
    draw.rectangle([cx0, cy0, cx1, cy1], fill=(8, 18, 40), outline=(30, 58, 138), width=2)
    
    trap = [(cx0 + 100, cy0 + 260), (cx0 + 300, cy1 - 160), (cx1 - 300, cy1 - 160), (cx1 - 100, cy0 + 260)]
    draw.line(trap, fill=(100, 116, 139), width=5)
    
    water_poly = [(cx0 + 150, cy0 + 420), (cx0 + 300, cy1 - 160), (cx1 - 300, cy1 - 160), (cx1 - 150, cy0 + 420)]
    draw.polygon(water_poly, fill=(14, 80, 130))
    
    for y in range(cy0 + 480, cy1 - 180, 55):
        norm = 1.0 - (y - (cy0 + 480)) / float(cy1 - 180 - (cy0 + 480))
        arrow_len = int(180 + 340 * math.sqrt(norm))
        x_start = cx0 + 340
        draw.line([(x_start, y), (x_start + arrow_len, y)], fill=(56, 189, 248), width=4)
        draw.polygon([(x_start + arrow_len, y - 8), (x_start + arrow_len + 16, y), (x_start + arrow_len, y + 8)], fill=(56, 189, 248))
        
    lx0, ly0, lx1, ly1 = 1300, 140, width - 100, 1300
    draw.rectangle([lx0, ly0, lx1, ly1], fill=(8, 18, 40), outline=(30, 58, 138), width=2)
    
    blocks = [
        ("T - 24h : BASELINE SENSOR AUDIT", "HASH: 9f8a3c...d84e", (52, 211, 153), "VALIDATED: No future state accessible"),
        ("T - 12h : IMD RADAR CLOUDBURST INGESTION", "HASH: e47b11...982a", (56, 189, 248), "PARTITION: t <= T_eval invariant enforced"),
        ("T - 6h : JOBRA BARRAGE BREACH THRESHOLD", "HASH: 3c59de...a710", (245, 158, 11), "STRICT ENVELOPE: Future hydrographs blocked"),
        ("T - 0h : LANDFALL CASUALTY AVOIDANCE", "HASH: 8b021a...ff34", (168, 85, 247), "EXECUTION: Statutory precedence compliant")
    ]
    for idx, (btitle, bhash, bcol, bstatus) in enumerate(blocks):
        by = ly0 + 100 + idx * 250
        draw.rectangle([lx0 + 60, by, lx1 - 60, by + 160], fill=(15, 23, 42), outline=bcol, width=2)
        draw.text((lx0 + 100, by + 26), btitle, fill=(255, 255, 255))
        draw.text((lx0 + 100, by + 68), bhash, fill=bcol)
        draw.text((lx0 + 100, by + 108), bstatus, fill=(148, 163, 184))
        if idx < 3:
            draw.line([(lx0 + (lx1 - lx0) // 2, by + 160), (lx0 + (lx1 - lx0) // 2, by + 250)], fill=(56, 189, 248), width=3)
            
    img = img.filter(ImageFilter.GaussianBlur(radius=2))
    out_path = os.path.join(ASSETS_DIR, 'hydrodynamic_physics_hd.png')
    img.save(out_path, format='PNG', compress_level=1)
    print(f"Saved: {out_path} ({os.path.getsize(out_path)} bytes)")

def generate_textured_digital_twin(width=2560, height=1440):
    img = Image.new('RGB', (width, height), (4, 10, 26))
    draw = ImageDraw.Draw(img)
    
    for i in range(50):
        y = i * 30
        draw.line([(0, y), (width, y)], fill=(12, 24, 52), width=1)
        
    nodes = [
        ("33kV Bidanasi Substation", int(width * 0.18), int(height * 0.50), (239, 68, 68)),
        ("Chhatra Bazar Water Plant", int(width * 0.40), int(height * 0.30), (245, 158, 11)),
        ("Madhusudan Causeway Link", int(width * 0.40), int(height * 0.70), (245, 158, 11)),
        ("SCB Medical College ICU", int(width * 0.65), int(height * 0.30), (239, 68, 68)),
        ("NH-16 Elevated Bypass", int(width * 0.65), int(height * 0.70), (16, 185, 129)),
        ("State Emergency Center (SEOC)", int(width * 0.85), int(height * 0.50), (168, 85, 247))
    ]
    edges = [(0, 1), (0, 2), (1, 3), (2, 3), (2, 4), (3, 5), (4, 5)]
    for n1, n2 in edges:
        p1 = (nodes[n1][1], nodes[n1][2])
        p2 = (nodes[n2][1], nodes[n2][2])
        draw.line([p1, p2], fill=(56, 189, 248), width=5)
        for step in range(8):
            t = (step + 1) / 9.0
            bx = int(p1[0] + (p2[0] - p1[0]) * t)
            by = int(p1[1] + (p2[1] - p1[1]) * t)
            draw.ellipse([bx - 8, by - 8, bx + 8, by + 8], fill=(56, 189, 248), outline=(255, 255, 255), width=2)
            
    for name, x, y, col in nodes:
        draw.ellipse([x - 55, y - 55, x + 55, y + 55], fill=(15, 23, 42), outline=col, width=6)
        draw.ellipse([x - 28, y - 28, x + 28, y + 28], fill=col)
        draw.ellipse([x - 80, y - 80, x + 80, y + 80], outline=col, width=1)
        
    out_path = os.path.join(ASSETS_DIR, 'digital_twin_topology_hd.png')
    img.save(out_path, format='PNG', compress_level=1)
    print(f"Saved: {out_path} ({os.path.getsize(out_path)} bytes)")

def generate_textured_translation_gap(width=2560, height=1440):
    img = Image.new('RGB', (width, height), (5, 12, 28))
    draw = ImageDraw.Draw(img)
    mid_x = width // 2
    
    draw.rectangle([80, 80, mid_x - 40, height - 80], fill=(22, 10, 18), outline=(239, 68, 68), width=4)
    draw.rectangle([mid_x + 40, 80, width - 80, height - 80], fill=(8, 26, 36), outline=(16, 185, 129), width=4)
    
    silos = [
        ("CWC Hydrology PDF Bulletin", "4-6 Hour Ingestion Lag", "Raw RL 21.65m (Incomprehensible to public)"),
        ("IMD Doppler Weather Radar", "Isolated Meteorologist Portal", "dBZ Reflectivity unmapped to street flooding"),
        ("INCOIS Marine Ocean Gauge", "Separate Port Authority Feed", "+2.3m Tide uncoupled from river backwater"),
        ("Citizen Ground Reality", "ZERO Timely Notification", "Evacuation delayed until floodwater enters homes")
    ]
    for i, (title, tag, desc) in enumerate(silos):
        sy = 220 + i * 260
        draw.rectangle([130, sy, mid_x - 90, sy + 200], fill=(32, 16, 24), outline=(160, 45, 55), width=2)
        draw.text((170, sy + 35), title, fill=(255, 255, 255))
        draw.text((170, sy + 85), tag, fill=(239, 68, 68))
        draw.text((170, sy + 130), desc, fill=(185, 195, 210))
        
    sol_items = [
        ("Sub-120ms Ingestion Bus", "Instantaneous Multi-Source Fusion", "CWC + IMD + INCOIS + ESA unified in real-time"),
        ("Deterministic Physics Core", "Manning's Equation & Estuary Profile", "Exact street-level flood depth (0.45m - 1.20m)"),
        ("Lifeline Cascades Engine", "Digital Twin Interdependency Graph", "Pre-empts substation, water plant & ICU failures"),
        ("Citizen Multilingual Voice/SMS", "Odia • Hindi • English • Bengali", "Clear actionable life-saving instructions in seconds")
    ]
    for i, (title, tag, desc) in enumerate(sol_items):
        sy = 220 + i * 260
        draw.rectangle([mid_x + 90, sy, width - 130, sy + 200], fill=(14, 40, 52), outline=(20, 120, 120), width=2)
        draw.text((mid_x + 130, sy + 35), title, fill=(255, 255, 255))
        draw.text((mid_x + 130, sy + 85), tag, fill=(52, 211, 153))
        draw.text((mid_x + 130, sy + 130), desc, fill=(205, 225, 240))
        
    img = img.filter(ImageFilter.GaussianBlur(radius=2))
    out_path = os.path.join(ASSETS_DIR, 'translation_gap_infographic_hd.png')
    img.save(out_path, format='PNG', compress_level=1)
    print(f"Saved: {out_path} ({os.path.getsize(out_path)} bytes)")

def generate_textured_national_roadmap(width=2560, height=1440):
    img = Image.new('RGB', (width, height), (3, 8, 26))
    draw = ImageDraw.Draw(img)
    
    pts = [
        (640, 300), (1280, 160), (1890, 300),
        (1780, 700), (1490, 1120), (1280, 1280),
        (1070, 1120), (770, 700)
    ]
    draw.polygon(pts, fill=(10, 28, 55))
    draw.line(pts + [pts[0]], fill=(32, 70, 130), width=4)
    
    coastal_arc = [
        (770, 700), (900, 900), (1070, 1120), (1280, 1280), (1490, 1120), (1650, 900), (1780, 700)
    ]
    draw.line(coastal_arc, fill=(56, 189, 248), width=8)
    
    hubs = [
        ("Odisha SEOC (Paradip / Cuttack)", 1710, 720, (239, 68, 68), "PHASE 1: LIVE PILOT"),
        ("Tamil Nadu TNSDMA (Chennai)", 1550, 1040, (245, 158, 11), "PHASE 2: PILOT EXPANSION"),
        ("Andhra Pradesh APDMA (Visakhapatnam)", 1650, 850, (245, 158, 11), "PHASE 2: EXPANSION"),
        ("West Bengal WBDMA (Kolkata)", 1790, 590, (245, 158, 11), "PHASE 2: EXPANSION"),
        ("Gujarat GSDMA (Kandla / Surat)", 720, 640, (168, 85, 247), "PHASE 3: NATIONAL MESH")
    ]
    for hname, hx, hy, hcol, hphase in hubs:
        draw.ellipse([hx - 22, hy - 22, hx + 22, hy + 22], fill=hcol, outline=(255, 255, 255), width=4)
        draw.ellipse([hx - 48, hy - 48, hx + 48, hy + 48], outline=hcol, width=2)
        draw.rectangle([hx + 40, hy - 26, hx + 600, hy + 32], fill=(3, 7, 18), outline=hcol, width=1)
        draw.text((hx + 52, hy - 18), hname, fill=(255, 255, 255))
        draw.text((hx + 52, hy + 6), hphase, fill=hcol)
        
    img = img.filter(ImageFilter.GaussianBlur(radius=2))
    out_path = os.path.join(ASSETS_DIR, 'national_mission_roadmap_hd.png')
    img.save(out_path, format='PNG', compress_level=1)
    print(f"Saved: {out_path} ({os.path.getsize(out_path)} bytes)")

if __name__ == '__main__':
    print("Generating comprehensive UHD 4K/2K presentation graphics suite...")
    generate_textured_planetary_earth(3840, 2160)
    generate_textured_gis_radar(3840, 2160)
    generate_textured_flood_hazard(2560, 1440)
    generate_textured_telemetry_grid(2560, 1440)
    generate_textured_google_maps_grounding(2560, 1440)
    generate_textured_hydrodynamic_physics(2560, 1440)
    generate_textured_digital_twin(2560, 1440)
    generate_textured_translation_gap(2560, 1440)
    generate_textured_national_roadmap(2560, 1440)
