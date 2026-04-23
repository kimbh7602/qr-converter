import { QrGenerator } from "@/components/qr-generator/QrGenerator";
import styles from "./page.module.css";

export default function HomePage() {
  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <a href="/" className={styles.wordmark} aria-label="qr home">
          qr<span className={styles.wordmarkDot}>.</span>
        </a>
        <a
          className={styles.sourceLink}
          href="https://github.com/kimbh7602/qr-converter"
          target="_blank"
          rel="noreferrer"
        >
          source
        </a>
      </header>

      <section className={styles.hero}>
        <h1 className={styles.heroHeadline}>
          url in. <span className={styles.heroAccent}>qr out.</span>
        </h1>
        <p className={styles.heroSub}>
          paste a link. download as svg or png. nothing leaves your browser.
        </p>
      </section>

      <QrGenerator />

      <footer className={styles.footer}>
        <span>runs entirely in your browser</span>
        <span className={styles.footerMeta}>© 2026 / no tracking</span>
      </footer>
    </main>
  );
}
