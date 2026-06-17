import DashboardLayout from '../components/DashboardLayout'
import { CreditCard, Download, CheckCircle } from 'lucide-react'

const Billing = () => {
  const invoices = [
    { id: 1, date: '2024-01-01', amount: '$29.00', status: 'Paid' },
    { id: 2, date: '2023-12-01', amount: '$29.00', status: 'Paid' },
    { id: 3, date: '2023-11-01', amount: '$29.00', status: 'Paid' },
  ]

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[#0a0a0a] p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Billing & Subscription</h1>
            <p className="text-gray-400">Manage your subscription and billing</p>
          </div>

          <div className="space-y-6">
            <div className="bg-[#111111] border border-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-4">Current Plan</h2>
              <div className="bg-gradient-to-br from-[#6366f1]/10 to-purple-500/10 border border-[#6366f1]/20 rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-1">Pro Plan</h3>
                    <p className="text-gray-400">Full access to all features</p>
                  </div>
                  <span className="text-3xl font-bold text-white">$29<span className="text-lg text-gray-400">/mo</span></span>
                </div>
                
                <div className="space-y-2 mb-4">
                  {['Unlimited AI Resume Analysis', 'Advanced Job Matching', 'Priority Support'].map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-gray-300">
                      <CheckCircle className="text-green-400" size={16} />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                <p className="text-sm text-gray-500">Next billing date: February 1, 2024</p>
              </div>
            </div>

            <div className="bg-[#111111] border border-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-4">Payment Method</h2>
              <div className="flex items-center justify-between bg-[#1a1a1a] border border-gray-800 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#6366f1]/10 rounded-lg flex items-center justify-center">
                    <CreditCard className="text-[#6366f1]" size={20} />
                  </div>
                  <div>
                    <p className="text-white font-medium">•••• •••• •••• 4242</p>
                    <p className="text-sm text-gray-500">Expires 12/2025</p>
                  </div>
                </div>
                <button className="px-4 py-2 bg-[#1a1a1a] hover:bg-[#222222] border border-gray-800 text-white rounded-lg transition-colors">
                  Update
                </button>
              </div>
            </div>

            <div className="bg-[#111111] border border-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-4">Billing History</h2>
              <div className="space-y-2">
                {invoices.map(invoice => (
                  <div key={invoice.id} className="flex items-center justify-between bg-[#1a1a1a] border border-gray-800 rounded-lg p-4">
                    <div>
                      <p className="text-white font-medium">{invoice.date}</p>
                      <p className="text-sm text-gray-500">Invoice #{invoice.id}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-white font-bold">{invoice.amount}</span>
                      <span className="px-3 py-1 bg-green-500/10 text-green-400 rounded-full text-sm">
                        {invoice.status}
                      </span>
                      <button className="p-2 bg-[#1a1a1a] hover:bg-[#222222] border border-gray-800 rounded-lg transition-colors">
                        <Download className="text-gray-400" size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Billing
