import { useLocation } from 'react-router-dom'
import { Truck, ShieldCheck, Mail, Phone, Info } from 'lucide-react'

export const InfoPage = () => {
  const { pathname } = useLocation()
  
  let title = ''
  let content = null
  let Icon = Info
  
  if (pathname.includes('/shipping')) {
    title = 'Shipping Policy'
    Icon = Truck
    content = (
      <>
        <p className="mb-4">We offer worldwide carbon-neutral delivery. All shipments are tracked and insured to guarantee safe arrival of your considered goods.</p>
        <h3 className="font-bold mb-2 mt-6" style={{ color: 'var(--clr-text)' }}>Domestic Shipping</h3>
        <p className="mb-4">Standard domestic shipping takes 3-5 business days. Express options are available at checkout. Tracking information will be provided once your order has been dispatched.</p>
        <h3 className="font-bold mb-2 mt-6" style={{ color: 'var(--clr-text)' }}>International Shipping</h3>
        <p>International delivery takes 7-14 business days depending on the destination. Please note that customs fees and import duties may apply and are the responsibility of the customer.</p>
      </>
    )
  } else if (pathname.includes('/returns')) {
    title = 'Returns & Exchanges'
    Icon = ShieldCheck
    content = (
      <>
        <p className="mb-4">We accept returns within 30 days of purchase for a full refund or exchange, ensuring you are completely satisfied with your item.</p>
        <p className="mb-4">Items must be unused, unwashed, and in their original condition with all tags and packaging intact.</p>
        <p>To initiate a return, please visit your Orders page or contact our support team directly. Refunds are processed to the original payment method within 5-7 business days of receiving the returned item.</p>
      </>
    )
  } else if (pathname.includes('/contact')) {
    title = 'Contact Us'
    Icon = Mail
    content = (
      <>
        <p className="mb-6">We're here to help. Reach out to us through the following channels for any inquiries, support, or feedback.</p>
        <div className="flex-col gap-6 mt-4">
          <div className="flex items-start gap-4 p-4 rounded-lg" style={{ background: 'rgba(245, 241, 234, 0.03)', border: '1px solid var(--clr-border)' }}>
            <Mail className="text-primary mt-1" size={20} />
            <div>
              <div className="text-xs uppercase tracking-wider text-muted mb-1 font-bold">Email Support</div>
              <a href="mailto:gangprajwal7@gmail.com" className="text-lg font-display hover:underline" style={{ color: 'var(--clr-text)' }}>gangprajwal7@gmail.com</a>
            </div>
          </div>
          <div className="flex items-start gap-4 p-4 rounded-lg mt-4" style={{ background: 'rgba(245, 241, 234, 0.03)', border: '1px solid var(--clr-border)' }}>
            <Phone className="text-primary mt-1" size={20} />
            <div>
              <div className="text-xs uppercase tracking-wider text-muted mb-1 font-bold">Phone Support</div>
              <a href="tel:9876543210" className="text-lg font-display hover:underline" style={{ color: 'var(--clr-text)' }}>9876543210</a>
            </div>
          </div>
        </div>
      </>
    )
  } else {
    title = 'Information'
    content = <p>This page is currently being updated. Please check back later.</p>
  }

  return (
    <div className="container page">
      <div className="max-w-lg mx-auto animate-in">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center justify-center rounded-full" style={{ width: 48, height: 48, background: 'var(--clr-primary-glow)', color: 'var(--clr-primary-light)' }}>
            <Icon size={24} />
          </div>
          <h1 className="section-title" style={{ margin: 0 }}>{title}</h1>
        </div>
        
        <div className="card">
          <div className="card-body text-secondary" style={{ lineHeight: 1.8, fontSize: '0.95rem' }}>
            {content}
          </div>
        </div>
      </div>
    </div>
  )
}
