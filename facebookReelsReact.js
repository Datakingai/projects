// facebookReelsReact.js

const reelsText = "Click to see my Facebook reels";

function FacebookReelsLink() {
  return (
    React.createElement(
      'span',
      {
        className: 'facebook-reels-react-link',
        style: { cursor: 'pointer', display: 'inline-block', fontWeight: 'bold', fontSize: '1.2em', color: '#1877f2', margin: '16px 0' },
        onClick: () => { window.location.href = 'reels.html'; },
        title: 'Go to Facebook Reels',
      },
      ...reelsText.split('').map((char, idx) =>
        React.createElement(
          'span',
          {
            key: idx,
            style: { display: 'inline-block', transition: 'transform 0.2s', marginRight: char === ' ' ? '0.25em' : '0' },
            onMouseEnter: e => e.target.style.transform = 'scale(1.2)',
            onMouseLeave: e => e.target.style.transform = 'scale(1)',
          },
          char
        )
      )
    )
  );
}

const root = document.getElementById('facebookReelsReactRoot');
if (root) {
  ReactDOM.createRoot(root).render(React.createElement(FacebookReelsLink));
}
