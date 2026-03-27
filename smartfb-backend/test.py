import requests

cookies = {
    'aid': '25e36034-1f53-41d3-b378-3f1c619e98fb',
    'cf_clearance': 'eEb76AzlOGvzR1mg3aLmhOHHp8BMqxQ1fDNZdJefnLI-1774582627-1.2.1.1-mrOgk18u8AdYuo1mNDUQOQ_5iPjVfW8lTpg7nsvUUqaONxH8pMYHRWzDCQROFkjqLZqTD_pz7s0X6LVBePZ8O3co4fUhSudevzK.Wn0hLdf6B1zPVugA.PDEk4o.2dhb4hIpZAUampg3uaGpC7qGrdqiPnSb0GZBQ_mtk_2mGdixBZpPlWdJcwOK5AP9727gXjl6rjiLrzJrfDWt1ZE9AJaU.XmBV.VywsubVnERuMU',
    '__Secure-session': 'YWdlLWVuY3J5cHRpb24ub3JnL3YxCi0-IFgyNTUxOSBGdWtKZXBScEJ6c2F5emh6dWp0VEdjK2NDazJJbjN5S1VPcDd3THc1WXhRCnlpMnl2d1pLeloybTEraTlYaDlyRGR4MEQwOXIyVlRYT3RuVW54M3p4dDgKLS0tIFFITi9BT1lwVHhXTWVDb1BxTCtzNmcvbDZQR1hwRlJwRFg5TXM3K0w3TjAKSJxf-QthsIVhIv_9vtPniwuZ8T72I2X5ZYaFifVSXgblo824fbrixU4nqofCuelR7mJNEeeUB0Xgqc6OsoErn7Z0iR_swlbwLvsGatV23l__GJxxWTODTZ7ARC1ndR5186dQLQE-J4TMzZJ1tIU_ZeGWWMAzRBaOULV0infR4_VmwJNShph8HtSwzQ==',
}

headers = {
    'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
    'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
    'priority': 'u=0, i',
    'referer': 'https://ollama.com/settings/keys',
    'sec-ch-ua': '"Chromium";v="146", "Not-A.Brand";v="24", "Microsoft Edge";v="146"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"macOS"',
    'sec-fetch-dest': 'document',
    'sec-fetch-mode': 'navigate',
    'sec-fetch-site': 'same-origin',
    'sec-fetch-user': '?1',
    'upgrade-insecure-requests': '1',
    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0',
    # 'cookie': 'aid=25e36034-1f53-41d3-b378-3f1c619e98fb; cf_clearance=eEb76AzlOGvzR1mg3aLmhOHHp8BMqxQ1fDNZdJefnLI-1774582627-1.2.1.1-mrOgk18u8AdYuo1mNDUQOQ_5iPjVfW8lTpg7nsvUUqaONxH8pMYHRWzDCQROFkjqLZqTD_pz7s0X6LVBePZ8O3co4fUhSudevzK.Wn0hLdf6B1zPVugA.PDEk4o.2dhb4hIpZAUampg3uaGpC7qGrdqiPnSb0GZBQ_mtk_2mGdixBZpPlWdJcwOK5AP9727gXjl6rjiLrzJrfDWt1ZE9AJaU.XmBV.VywsubVnERuMU; __Secure-session=YWdlLWVuY3J5cHRpb24ub3JnL3YxCi0-IFgyNTUxOSBGdWtKZXBScEJ6c2F5emh6dWp0VEdjK2NDazJJbjN5S1VPcDd3THc1WXhRCnlpMnl2d1pLeloybTEraTlYaDlyRGR4MEQwOXIyVlRYT3RuVW54M3p4dDgKLS0tIFFITi9BT1lwVHhXTWVDb1BxTCtzNmcvbDZQR1hwRlJwRFg5TXM3K0w3TjAKSJxf-QthsIVhIv_9vtPniwuZ8T72I2X5ZYaFifVSXgblo824fbrixU4nqofCuelR7mJNEeeUB0Xgqc6OsoErn7Z0iR_swlbwLvsGatV23l__GJxxWTODTZ7ARC1ndR5186dQLQE-J4TMzZJ1tIU_ZeGWWMAzRBaOULV0infR4_VmwJNShph8HtSwzQ==',
}

response = requests.get('https://ollama.com/settings', cookies=cookies, headers=headers)

print(response.text)