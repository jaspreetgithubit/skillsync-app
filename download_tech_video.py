import urllib.request
import os
import sys

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

# Candidate URLs for modern tech office, programmers coding, tech team collaborating
candidates = [
    # Mixkit CDN tech team / programmer videos
    "https://assets.mixkit.co/videos/42844/42844-720.mp4", # Diverse team of programmers working in modern tech office
    "https://assets.mixkit.co/videos/42841/42841-720.mp4", # Software developer working on dual-monitor code
    "https://assets.mixkit.co/videos/42838/42838-720.mp4", # Tech workspace laptop office
    "https://assets.mixkit.co/videos/34440/34440-720.mp4", # Modern tech office team meeting
    "https://assets.mixkit.co/videos/40960/40960-720.mp4", # Corporate tech glass office
    # GitHub raw sample tech video
    "https://raw.githubusercontent.com/intel-iot-devkit/sample-videos/master/person-bicycle-car-detection.mp4"
]

target_dir = os.path.join(os.getcwd(), 'public', 'videos')
os.makedirs(target_dir, exist_ok=True)

target_file = os.path.join(target_dir, 'office-loop.mp4')
target_file2 = os.path.join(target_dir, 'cinematic-demo.mp4')

downloaded = False

for url in candidates:
    print(f"Trying: {url} ...")
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=12) as response:
            if response.status == 200:
                content_length = response.headers.get('Content-Length')
                print(f"Connected! Size: {content_length} bytes. Downloading...")
                data = response.read()
                if len(data) > 100000: # at least 100KB
                    with open(target_file, 'wb') as f:
                        f.write(data)
                    with open(target_file2, 'wb') as f:
                        f.write(data)
                    print(f"Successfully downloaded tech corporate video ({len(data)} bytes) to {target_file}")
                    downloaded = True
                    break
    except Exception as e:
        print(f"Failed with {url}: {e}")

if not downloaded:
    print("Could not download external video, trying Wikimedia or fallback direct mirrors...")
    backup_urls = [
        "https://cdn.pixabay.com/video/2016/09/21/5495-184518712_medium.mp4", # Tech office / coding
        "https://cdn.pixabay.com/video/2020/04/16/36384-411226955_medium.mp4"  # Programmers in office
    ]
    for url in backup_urls:
        try:
            req = urllib.request.Request(url, headers=headers)
            with urllib.request.urlopen(req, timeout=12) as response:
                data = response.read()
                if len(data) > 100000:
                    with open(target_file, 'wb') as f:
                        f.write(data)
                    with open(target_file2, 'wb') as f:
                        f.write(data)
                    print(f"Successfully downloaded tech video ({len(data)} bytes)")
                    downloaded = True
                    break
        except Exception as e:
            print(f"Backup failed: {e}")
