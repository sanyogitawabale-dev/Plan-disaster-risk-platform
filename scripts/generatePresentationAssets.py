import math
import random
from PIL import Image, ImageDraw, ImageFilter

def create_rich_radar_map(filename, width=1920, height=1080):
    img = Image.new('RGB', (width, height), (3, 7, 18))
    draw = ImageDraw.Draw(img)
    
    # Intricate GIS coordinate grid
    for x in range(0, width, 40):
        c = (15, 23, 42) if x % 200 != 0 else (30, 41, 59)
        draw.line([(x, 0), (x, height)], fill=c, width=1)
    for y in range(0, height, 40):
        c = (15, 23, 42) if y % 200 != 0 else (30, 41, 59)
        draw.line([(0, y), (width, y)], fill=c, width=1)
        
    # Coastline contour (Bay of Bengal / Odisha coast curve)
    coast_pts = []
    for step in range(80):
        t = step / 79.0
        x = 900 + int(700 * math.sin(t * 2.8)) + int(35 * math.sin(t * 18))
        y = int(height * t)
        coast_pts.append((x, y))
    
    # Fill ocean sector
    ocean_polygon = [(width, 0), (width, height), (coast_pts[-1][0], height)] + coast_pts[::-1] + [(coast_pts[0][0], 0)]
    draw.polygon(ocean_polygon, fill=(6, 24, 48))
    draw.line(coast_pts, fill=(56, 189, 248), width=3)
    
    # Coastal bathymetry depth contours
    for offset in [60, 140, 240, 360, 500]:
        offset_pts = [(min(width, pt[0] + offset), pt[1]) for pt in coast_pts]
        draw.line(offset_pts, fill=(14, 116, 144), width=1)
        
    # Doppler radar concentric range rings at Paradip (1350, 450)
    rx, ry = 1350, 450
    for r in range(60, 900, 75):
        draw.ellipse([rx - r, ry - r, rx + r, ry + r], outline=(56, 189, 248), width=1)
        
    # Cyclonic storm spiral bands
    random.seed(42)
    for band in range(6):
        for step in range(200):
            theta = step * 0.08 + band * 1.05
            dist = 30 + step * 3.8
            x = rx + int(dist * math.cos(theta))
            y = ry + int(dist * math.sin(theta))
            radius = int(12 + step * 0.25)
            # Weather radar dbz colors
            if dist < 180:
                col = (239, 68, 68) # Red core
            elif dist < 340:
                col = (245, 158, 11) # Orange
            elif dist < 520:
                col = (16, 185, 129) # Green
            else:
                col = (14, 165, 233) # Cyan
            draw.ellipse([x - radius, y - radius, x + radius, y + radius], fill=col)
            
    # Soft blur to create realistic Doppler radar heat-map
    img = img.filter(ImageFilter.GaussianBlur(radius=8))
    
    # Add sharp sensor pins on top
    draw2 = ImageDraw.Draw(img)
    pins = [
        ("Jobra Barrage (21.65m)", 880, 410, (239, 68, 68)),
        ("OPTCL Substation", 1250, 420, (245, 158, 11)),
        ("INCOIS Buoy BD12", 1520, 680, (56, 189, 248)),
        ("OSDMA Shelter #4", 1020, 320, (16, 185, 129))
    ]
    for label, px, py, pcol in pins:
        draw2.ellipse([px - 10, py - 10, px + 10, py + 10], fill=pcol, outline=(255, 255, 255), width=2)
        draw2.ellipse([px - 22, py - 22, px + 22, py + 22], outline=pcol, width=1)
        
    img.save(filename, format='PNG', compress_level=1)
    print(f"Created rich GIS radar map: {filename}")

def create_digital_twin_topology_hd(filename, width=1920, height=1080):
    img = Image.new('RGB', (width, height), (4, 10, 24))
    draw = ImageDraw.Draw(img)
    
    # Background circuit traces
    for i in range(40):
        y = i * 28
        draw.line([(0, y), (width, y)], fill=(12, 24, 48), width=1)
        
    nodes = [
        ("33kV Bidanasi Substation", 320, 540, (239, 68, 68), "TRIGGER: Inundated +0.65m"),
        ("Chhatra Bazar Water Plant", 740, 320, (245, 158, 11), "CASCADE 1: Power Tripped"),
        ("Madhusudan Causeway", 740, 760, (245, 158, 11), "CASCADE 2: Submerged 0.85m"),
        ("SCB Medical College ICU", 1220, 320, (239, 68, 68), "CRITICAL: DG Fuel Endangered"),
        ("NH-16 Elevated Bypass", 1220, 760, (16, 185, 129), "SAFE: High-Ground Corridor"),
        ("State Emergency Center (SEOC)", 1600, 540, (168, 85, 247), "COMMAND: Automated Dispatch")
    ]
    
    # Interconnecting electrical and logistics vectors
    edges = [(0, 1), (0, 2), (1, 3), (2, 3), (2, 4), (3, 5), (4, 5)]
    for n1, n2 in edges:
        p1 = (nodes[n1][1], nodes[n1][2])
        p2 = (nodes[n2][1], nodes[n2][2])
        draw.line([p1, p2], fill=(56, 189, 248), width=4)
        for step in range(6):
            t = (step + 1) / 7.0
            bx = int(p1[0] + (p2[0] - p1[0]) * t)
            by = int(p1[1] + (p2[1] - p1[1]) * t)
            draw.ellipse([bx - 6, by - 6, bx + 6, by + 6], fill=(56, 189, 248), outline=(255, 255, 255), width=2)
            
    for name, x, y, col, desc in nodes:
        draw.ellipse([x - 45, y - 45, x + 45, y + 45], fill=(15, 23, 42), outline=col, width=5)
        draw.ellipse([x - 22, y - 22, x + 22, y + 22], fill=col)
        draw.ellipse([x - 65, y - 65, x + 65, y + 65], outline=col, width=1)
        
    img.save(filename, format='PNG', compress_level=1)
    print(f"Created digital twin topology: {filename}")

def create_planetary_earth_hd(filename, width=1920, height=1080):
    img = Image.new('RGB', (width, height), (2, 6, 23))
    draw = ImageDraw.Draw(img)
    
    cx, cy = 1380, 540
    r = 420
    
    # Multi-layer atmospheric glow
    for dr in range(120, 0, -4):
        draw.ellipse([cx - r - dr, cy - r - dr, cx + r + dr, cy + r + dr], outline=(56, 189, 248), width=3)
        
    # Base Earth sphere
    draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(8, 28, 56), outline=(56, 189, 248), width=4)
    
    # 3D Spherical longitude and latitude wireframe
    for lat_deg in range(-70, 80, 15):
        y_pos = int(r * math.sin(math.radians(lat_deg)))
        semi_w = int(r * math.cos(math.radians(lat_deg)))
        draw.ellipse([cx - semi_w, cy + y_pos - 18, cx + semi_w, cy + y_pos + 18], outline=(30, 58, 138), width=2)
        
    for lng_deg in range(-80, 90, 15):
        x_pos = int(r * math.sin(math.radians(lng_deg)))
        semi_h = int(r * math.cos(math.radians(lng_deg)))
        draw.ellipse([cx + x_pos - 18, cy - semi_h, cx + x_pos + 18, cy + semi_h], outline=(30, 58, 138), width=2)
        
    # Indian subcontinent silhouette landmass approximation
    india_points = [
        (cx - 180, cy - 140), (cx - 120, cy - 160), (cx - 60, cy - 150),
        (cx - 20, cy - 80), (cx + 40, cy - 20), (cx + 80, cy + 40),
        (cx + 40, cy + 120), (cx - 20, cy + 220), (cx - 60, cy + 180),
        (cx - 100, cy + 80), (cx - 160, cy + 10), (cx - 190, cy - 70)
    ]
    draw.polygon(india_points, fill=(16, 185, 129))
    draw.line(india_points + [india_points[0]], fill=(52, 211, 153), width=3)
    
    # Cyclone cloud vortex spiral over Bay of Bengal
    bx, by = cx + 60, cy + 40
    for i in range(180):
        theta = i * 0.1
        dist = 20 + i * 1.8
        px = bx + int(dist * math.cos(theta))
        py = by + int(dist * math.sin(theta))
        rad = int(14 + i * 0.15)
        draw.ellipse([px - rad, py - rad, px + rad, py + rad], fill=(240, 249, 255))
        
    img = img.filter(ImageFilter.GaussianBlur(radius=3))
    img.save(filename, format='PNG', compress_level=1)
    print(f"Created planetary earth HD: {filename}")

def create_multi_agency_telemetry_grid_hd(filename, width=1920, height=1080):
    img = Image.new('RGB', (width, height), (5, 12, 28))
    draw = ImageDraw.Draw(img)
    
    # 4-quadrant multi-agency dashboard grid
    mid_x, mid_y = width // 2, height // 2
    
    # Grid dividers
    draw.line([(mid_x, 0), (mid_x, height)], fill=(30, 58, 138), width=3)
    draw.line([(0, mid_y), (width, mid_y)], fill=(30, 58, 138), width=3)
    
    # Quadrant 1 (Top-Left): IMD Doppler Radar dBZ
    rx, ry = mid_x // 2, mid_y // 2
    for r in range(40, 360, 45):
        draw.ellipse([rx - r, ry - r, rx + r, ry + r], outline=(30, 64, 110), width=1)
    draw.line([(rx - 360, ry), (rx + 360, ry)], fill=(30, 64, 110), width=1)
    draw.line([(rx, ry - 360), (rx, ry + 360)], fill=(30, 64, 110), width=1)
    
    random.seed(101)
    for i in range(120):
        th = i * 0.12
        dist = 20 + i * 2.2
        px = rx + int(dist * math.cos(th))
        py = ry + int(dist * math.sin(th))
        rad = int(10 + i * 0.18)
        col = (239, 68, 68) if dist < 120 else ((245, 158, 11) if dist < 220 else (16, 185, 129))
        draw.ellipse([px - rad, py - rad, px + rad, py + rad], fill=col)
        
    # Quadrant 2 (Top-Right): CWC Hydrograph Stage Curve
    gx0, gy0, gx1, gy1 = mid_x + 60, 60, width - 60, mid_y - 60
    # Axis
    draw.line([(gx0, gy1), (gx1, gy1)], fill=(100, 116, 139), width=2)
    draw.line([(gx0, gy0), (gx0, gy1)], fill=(100, 116, 139), width=2)
    
    # Danger level line (Red)
    danger_y = gy0 + int((gy1 - gy0) * 0.35)
    draw.line([(gx0, danger_y), (gx1, danger_y)], fill=(239, 68, 68), width=2)
    
    # Warning level line (Amber)
    warning_y = gy0 + int((gy1 - gy0) * 0.55)
    draw.line([(gx0, warning_y), (gx1, warning_y)], fill=(245, 158, 11), width=2)
    
    # Hydrograph points curve
    h_pts = []
    num_pts = 60
    for idx in range(num_pts):
        px = gx0 + int((gx1 - gx0) * (idx / (num_pts - 1)))
        norm_t = idx / (num_pts - 1)
        # Rising hydrograph peaking at 70% of time
        val = math.exp(-((norm_t - 0.70) ** 2) / 0.08)
        py = gy1 - int((gy1 - gy0 - 40) * (0.2 + 0.75 * val))
        h_pts.append((px, py))
    draw.line(h_pts, fill=(56, 189, 248), width=4)
    # Area under curve
    poly = [(gx0, gy1)] + h_pts + [(gx1, gy1)]
    draw.polygon(poly, fill=(14, 116, 144))
    
    # Quadrant 3 (Bottom-Left): ESA Sentinel-1 SAR Backscatter
    sx0, sy0, sx1, sy1 = 40, mid_y + 40, mid_x - 40, height - 40
    for y in range(sy0, sy1, 8):
        for x in range(sx0, sx1, 8):
            noise = (int(math.sin(x * 0.05) * math.cos(y * 0.05) * 60) + 120) % 255
            # SAR river path
            dist_to_center = abs(y - (sy0 + (sy1 - sy0) // 2) - int(math.sin(x * 0.02) * 50))
            if dist_to_center < 35:
                # Water backscatter is dark in SAR
                c = (8, 20, 45)
            elif dist_to_center < 70 and random.random() > 0.4:
                # Inundated vegetation (medium)
                c = (30, 80, 110)
            else:
                c = (15 + (noise // 6), 25 + (noise // 5), 45 + (noise // 4))
            draw.rectangle([x, y, x + 8, y + 8], fill=c)
            
    # Quadrant 4 (Bottom-Right): INCOIS Coastal Storm Surge Wave Buoy
    bx0, by0, bx1, by1 = mid_x + 40, mid_y + 40, width - 40, height - 40
    # Draw ocean bathymetry bands
    for idx, off in enumerate(range(0, by1 - by0, 15)):
        y_line = by0 + off
        wave_pts = []
        for step in range(50):
            wx = bx0 + int((bx1 - bx0) * (step / 49.0))
            wy = y_line + int(12 * math.sin(step * 0.4 + idx * 0.5))
            wave_pts.append((wx, wy))
        draw.line(wave_pts, fill=(14, 116, 144) if idx % 2 == 0 else (6, 78, 120), width=2)
        
    img = img.filter(ImageFilter.GaussianBlur(radius=2))
    
    # Crisp telemetry labels
    draw2 = ImageDraw.Draw(img)
    labels = [
        ("IMD DWR PARADIP // 3 GHz DOPPLER RADAR (42 mm/h CORE)", 40, 30, (56, 189, 248)),
        ("CWC JOBRA BARRAGE // 72H STAGE HYDROGRAPH [21.65m PEAK]", mid_x + 40, 30, (239, 68, 68)),
        ("ESA SENTINEL-1 SAR // C-BAND BACKSCATTER INUNDATION SWATH", 40, mid_y + 20, (52, 211, 153)),
        ("INCOIS BUOY BD12 // +2.30m STORM SURGE TIDAL INTERACTION", mid_x + 40, mid_y + 20, (245, 158, 11))
    ]
    for text, lx, ly, lcol in labels:
        draw2.rectangle([lx - 10, ly - 6, lx + 620, ly + 26], fill=(3, 7, 18), outline=lcol, width=1)
        
    img.save(filename, format='PNG', compress_level=1)
    print(f"Created multi-agency telemetry grid: {filename}")

def create_flood_hazard_depth_hd(filename, width=1920, height=1080):
    img = Image.new('RGB', (width, height), (3, 8, 20))
    draw = ImageDraw.Draw(img)
    
    # Contour elevation field
    for r in range(800, 100, -50):
        pts = []
        for step in range(70):
            th = step / 69.0 * 2 * math.pi
            rad = r + int(40 * math.sin(step * 0.8))
            px = 960 + int(rad * math.cos(th) * 1.4)
            py = 540 + int(rad * math.sin(th) * 0.8)
            pts.append((px, py))
        draw.polygon(pts, fill=(int(8 + (800 - r) * 0.02), int(18 + (800 - r) * 0.04), int(35 + (800 - r) * 0.06)))
        draw.line(pts + [pts[0]], fill=(30, 58, 138), width=1)
        
    # Braided river system (Mahanadi & Kathajodi)
    river1 = []
    river2 = []
    for step in range(80):
        x = int(width * (step / 79.0))
        y1 = 480 + int(120 * math.sin(step * 0.08)) + int(20 * math.cos(step * 0.25))
        y2 = y1 + 140 + int(60 * math.sin(step * 0.1))
        river1.append((x, y1))
        river2.append((x, y2))
    draw.line(river1, fill=(14, 165, 233), width=18)
    draw.line(river2, fill=(14, 165, 233), width=14)
    
    # Flood pooling zones (Inundation depths)
    # Zone 1: Severe Inundation (> 1.2m) - Red/Crimson
    draw.ellipse([800, 420, 1150, 680], fill=(185, 28, 28))
    # Zone 2: Moderate Inundation (0.5m - 1.2m) - Orange
    draw.ellipse([700, 360, 1280, 740], outline=(245, 158, 11), width=4)
    # Zone 3: Shallow Inundation (0.2m - 0.5m) - Yellow/Amber
    draw.ellipse([580, 300, 1420, 820], outline=(251, 191, 36), width=2)
    
    # Safe Evacuation Highway Corridor (NH-16 elevated flyover) - Bright Green
    hwy = [(200, 220), (550, 260), (950, 280), (1400, 260), (1750, 210)]
    draw.line(hwy, fill=(16, 185, 129), width=8)
    for hx, hy in hwy:
        draw.ellipse([hx - 12, hy - 12, hx + 12, hy + 12], fill=(16, 185, 129), outline=(255, 255, 255), width=3)
        
    img = img.filter(ImageFilter.GaussianBlur(radius=4))
    
    # Sharp overlay markers and shelters
    draw2 = ImageDraw.Draw(img)
    shelters = [
        ("SHELTER #1: Ravenshaw University (Cap: 4,500)", 620, 220),
        ("SHELTER #2: Barabati Stadium Complex (Cap: 8,000)", 1050, 230),
        ("SHELTER #3: SCB Medical Elevated Ward (Cap: 2,200)", 1380, 210)
    ]
    for sname, sx, sy in shelters:
        draw2.rectangle([sx - 14, sy - 14, sx + 14, sy + 14], fill=(16, 185, 129), outline=(255, 255, 255), width=2)
        draw2.text((sx + 24, sy - 8), sname, fill=(255, 255, 255))
        
    img.save(filename, format='PNG', compress_level=1)
    print(f"Created flood hazard depth map: {filename}")

if __name__ == '__main__':
    create_rich_radar_map('public/assets/presentation/gis_radar_map_hd.png', 1920, 1080)
    create_digital_twin_topology_hd('public/assets/presentation/digital_twin_topology_hd.png', 1920, 1080)
    create_planetary_earth_hd('public/assets/presentation/planetary_earth_hd.png', 1920, 1080)
    create_multi_agency_telemetry_grid_hd('public/assets/presentation/multi_agency_telemetry_grid_hd.png', 1920, 1080)
    create_flood_hazard_depth_hd('public/assets/presentation/flood_hazard_depth_hd.png', 1920, 1080)
