import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { ArrowRight, ShieldCheck, Truck, Sparkles, ArrowUpRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { productApi } from '../api/productApi'
import { ProductCard } from '../components/ProductCard'

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 22 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] as const },
})

const editorial = [
  { tag: 'New Season', title: 'Quiet luxury, loud detail.', sub: 'Drop 04 — Crafted in muted earth tones.' },
  { tag: 'Atelier', title: 'Made by hand. Made to last.', sub: 'Independent makers from 42 countries.' },
  { tag: 'Edit', title: 'The Heritage Edit.', sub: 'Considered objects for considered living.' },
]

export const Home = () => {
  const { data: featured, isLoading } = useQuery({
    queryKey: ['featuredProducts'],
    queryFn: productApi.featured,
  })

  return (
    <div>
      {/* ============== HERO ============== */}
      <section className="hero">
        <div className="container" style={{ position: 'relative' }}>
          <motion.div {...fade(0)} style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <span className="glass" style={{
              padding: '0.45rem 1rem', borderRadius: '999px',
              fontSize: '0.72rem', letterSpacing: '0.18em', textTransform: 'uppercase',
              color: 'var(--clr-text-secondary)', fontWeight: 500,
            }}>
              <Sparkles size={12} style={{ display: 'inline', marginRight: 6, color: 'var(--clr-primary-light)' }} />
              Winter Collection · MMXXVI
            </span>
          </motion.div>

          <motion.h1 {...fade(0.08)} className="hero__title text-center">
            Objects of <span>quiet</span> distinction.
          </motion.h1>

          <motion.p {...fade(0.18)} className="hero__subtitle text-center">
            ShopVerse is a curated marketplace for refined goods — sourced from independent ateliers,
            chosen for craft, restraint, and the patience of materials.
          </motion.p>

          <motion.div {...fade(0.28)} className="flex gap-3 justify-center mt-6">
            <Link to="/products" className="btn btn-primary btn-lg">
              Enter the shop <ArrowRight size={18} />
            </Link>
            <Link to="/register" className="btn btn-outline btn-lg">
              Open an atelier
            </Link>
          </motion.div>

          {/* marquee categories */}
          <motion.div {...fade(0.4)} style={{
            marginTop: '5rem', display: 'flex', flexWrap: 'wrap', gap: '2rem 3rem',
            justifyContent: 'center', color: 'var(--clr-text-muted)',
            fontFamily: 'var(--font-display)', fontStyle: 'italic',
            fontSize: 'clamp(1rem, 1.4vw, 1.2rem)',
          }}>
            {['Apparel', 'Objects', 'Leather', 'Ceramics', 'Apothecary', 'Archive'].map(c => (
              <span key={c}>· {c}</span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ============== EDITORIAL BENTO ============== */}
      <section className="container" style={{ padding: '5rem 1.75rem 2rem' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(12, 1fr)',
          gridAutoRows: 'minmax(200px, auto)',
          gap: '1.25rem',
        }}>
          {editorial.map((card, i) => {
            const span = i === 0
              ? { gridColumn: 'span 7', gridRow: 'span 2' }
              : i === 1
                ? { gridColumn: 'span 5' }
                : { gridColumn: 'span 5' }
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.7, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  ...span,
                  position: 'relative', overflow: 'hidden',
                  borderRadius: 'var(--radius-xl)',
                  border: '1px solid var(--clr-border)',
                  background: i === 0
                    ? 'linear-gradient(160deg, #1e1b16 0%, #0c0c0c 100%)'
                    : i === 1
                      ? 'linear-gradient(160deg, #1a1a1a 0%, #161616 100%)'
                      : 'linear-gradient(160deg, #221d15 0%, #131110 100%)',
                  padding: 'clamp(1.5rem, 2.5vw, 2.5rem)',
                  display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                  cursor: 'pointer',
                  minHeight: i === 0 ? 360 : 220,
                }}
                className="bento-card"
              >
                <span style={{
                  fontSize: '0.68rem', letterSpacing: '0.2em', textTransform: 'uppercase',
                  color: 'var(--clr-primary-light)', fontWeight: 500,
                }}>{card.tag}</span>

                <div style={{ marginTop: 'auto' }}>
                  <h2 style={{
                    fontSize: i === 0 ? 'clamp(2rem, 4vw, 3.4rem)' : 'clamp(1.4rem, 2.2vw, 2rem)',
                    fontWeight: 400, letterSpacing: '-0.02em',
                    fontFamily: 'var(--font-display)',
                  }}>{card.title}</h2>
                  <p className="text-secondary text-sm" style={{ marginTop: '0.6rem', maxWidth: '40ch' }}>
                    {card.sub}
                  </p>
                  <div className="flex items-center gap-2 mt-4" style={{
                    fontSize: '0.78rem', letterSpacing: '0.14em', textTransform: 'uppercase',
                    color: 'var(--clr-text)', fontWeight: 500,
                  }}>
                    Discover <ArrowUpRight size={15} />
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* ============== FEATURED PRODUCTS ============== */}
      <section className="container" style={{ padding: '3rem 1.75rem 5rem' }}>
        <div className="section-header">
          <div>
            <div className="text-xs uppercase text-secondary" style={{ marginBottom: '0.6rem' }}>The Edit</div>
            <h2 className="section-title">Selected <span>this week</span></h2>
          </div>
          <Link to="/products" className="btn btn-outline btn-sm">
            View all <ArrowRight size={14} />
          </Link>
        </div>

        {isLoading ? (
          <div className="products-grid-lg">
            {[...Array(8)].map((_, i) => <div key={i} className="skeleton" style={{ height: 420 }} />)}
          </div>
        ) : featured && featured.length > 0 ? (
          <div className="products-grid-lg">
            {featured.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        ) : (
          <div className="text-center text-muted" style={{ padding: '4rem 0' }}>
            <p>The collection is being prepared.</p>
            <Link to="/products" className="btn btn-outline mt-4">Browse archive</Link>
          </div>
        )}
      </section>

      {/* ============== VALUE PROPS ============== */}
      <section className="container" style={{ padding: '2rem 1.75rem 6rem' }}>
        <div className="stats-grid">
          {[
            { icon: Truck, title: 'Carbon-neutral delivery', sub: 'Worldwide shipping, offset by default.' },
            { icon: ShieldCheck, title: 'Buyer protection', sub: 'Every order, every atelier, guaranteed.' },
            { icon: Sparkles, title: 'Verified makers', sub: 'Independently vetted, hand-selected.' },
          ].map((v, i) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="dash-stat"
            >
              <div className="dash-stat__icon"><v.icon size={20} /></div>
              <h3>{v.title}</h3>
              <p className="text-secondary text-sm">{v.sub}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ============== FOOTER ============== */}
      <footer style={{
        borderTop: '1px solid var(--clr-border)',
        padding: '4rem 0 2.5rem',
        marginTop: '2rem',
        background: 'linear-gradient(180deg, transparent, rgba(245,241,234,0.02))',
      }}>
        <div className="container" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '2.5rem',
        }}>
          <div>
            <div className="navbar__logo" style={{ marginBottom: '1rem' }}>ShopVerse</div>
            <p className="text-muted text-sm" style={{ maxWidth: '32ch' }}>
              A marketplace for considered goods. Founded MMXXIV.
            </p>
          </div>
          {[
            { h: 'Shop', l: ['New arrivals', 'All categories', 'Gift cards', 'Sale'] },
            { h: 'Atelier', l: ['Become a seller', 'Maker stories', 'Sustainability', 'Press'] },
            { h: 'Help', l: ['Orders', 'Shipping', 'Returns', 'Contact'] },
          ].map(col => (
            <div key={col.h}>
              <div className="text-xs uppercase text-secondary mb-3">{col.h}</div>
              {col.l.map(item => (
                <div key={item} style={{ marginBottom: '0.55rem' }}>
                  <a className="text-sm text-secondary hover:underline">{item}</a>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="container flex justify-between items-center" style={{
          marginTop: '3rem', paddingTop: '1.75rem', borderTop: '1px solid var(--clr-border)',
          fontSize: '0.78rem', color: 'var(--clr-text-muted)',
        }}>
          <span>© {new Date().getFullYear()} ShopVerse · All rights reserved</span>
          <span className="italic font-display">Made with patience.</span>
        </div>
      </footer>
    </div>
  )
}
