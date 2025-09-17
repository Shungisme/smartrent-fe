import { getInputType } from '@/constants/regex'

export const parseEmailOrPhone = (emailOrPhone: string) => {
  const inputType = getInputType(emailOrPhone)

  if (inputType === 'email') {
    return {
      email: emailOrPhone,
      phoneCode: '',
      phoneNumber: '',
    }
  } else if (inputType === 'phone') {
    if (emailOrPhone.startsWith('+84')) {
      return {
        email: '',
        phoneCode: '+84',
        phoneNumber: emailOrPhone.substring(3),
      }
    } else if (emailOrPhone.startsWith('84')) {
      return {
        email: '',
        phoneCode: '+84',
        phoneNumber: emailOrPhone.substring(2),
      }
    } else if (emailOrPhone.startsWith('0')) {
      return {
        email: '',
        phoneCode: '+84',
        phoneNumber: emailOrPhone.substring(1),
      }
    } else {
      return {
        email: '',
        phoneCode: '+84',
        phoneNumber: emailOrPhone,
      }
    }
  }

  return {
    email: emailOrPhone,
    phoneCode: '',
    phoneNumber: '',
  }
}
