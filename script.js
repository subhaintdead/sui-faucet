const form = document.getElementById('faucet-form');
const button = document.getElementById('sbutton');
const status = document.getElementById('status');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const address = document.getElementById('address').value.trim();

    const token = document.querySelector('[name=cf-turnstile-response]')?.value;

    if (!address.startsWith('0x') || address.length < 64) {
        showStatus('gng that aint a valid sui address', 'error');
        return;
    } if (!token) {
        showStatus('Please complete the captcha to continue.', 'error');
        return;
    }

    button.disabled = true;
    showStatus('', '');

    try {
        const potatoes = await fetch('/api/skibidi', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ address, token })
        });

        const data = await potatoes.json();

        if (potatoes.ok) {
            button.textContent = 'sent!';
            showStatus(`SUI sent! Tx: ${data.txHash}`, 'success');
        } else {
            button.disabled = false;
            button.textContent = 'Give me gas!';
            showStatus(data.error || 'something went wrong.', 'error');
        }
    } catch (err) {
        button.disabled = false;
        button.textContent = 'Give me gas!';
        showStatus('network error, try again', 'error');

    }

});

function showStatus(msg, type) {
    status.textContent = msg;
    status.className = type;
    status.style.display = msg ? 'block' : 'none';
}